import { Button, Card, Form, Input, Select, Tag, Typography, message } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { useCallback, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import dayjs from 'dayjs'

import { debounce, getOption } from '@ying/utils'
import { ListRoleDto, UpdateRoleDto } from '@ying/shared'
import { SysRoleEntity } from '@ying/shared/entities'
import { useDialogOpen } from '@ying/fontend-shared/hooks'

import { BasicStatusOptions, BasicStatusOption } from '@/admin/constant'
import { usePage } from '@/admin/hooks/use-page'
import { sysRoleApi } from '@/admin/api'
import { PageQuery } from '@/admin/components/page-query'
import { PageOperations } from '@/admin/components/page-operations'

import { RoleDrawer } from './role-drawer'

export default function RolePage() {
  const { control, watch, reset, getValues } = useForm<ListRoleDto>()

  const { list, listLoading, pagination, reload } = usePage({
    listApi: useCallback(
      ({ page, size }) =>
        sysRoleApi.list({
          ...getValues(),
          page,
          size
        }),
      [getValues]
    ),
    listCount: useCallback(
      () =>
        sysRoleApi.listCount({
          ...getValues()
        }),
      [getValues]
    )
  })

  useEffect(() => {
    const subscription = watch(debounce(reload, 500))
    return () => subscription.unsubscribe()
  }, [watch, reload])

  const roleDrawerPros = useDialogOpen<UpdateRoleDto>()

  const columns: ColumnsType<SysRoleEntity> = [
    {
      title: '角色名称',
      dataIndex: 'name',
      width: 300
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      width: 100,
      render: status => {
        const option = getOption<BasicStatusOption>(BasicStatusOptions, status)
        return <Tag color={option.color}>{option.label}</Tag>
      }
    },
    { title: '排序', dataIndex: 'sort', align: 'center', width: 60 },
    { title: '备注', dataIndex: 'remark' },
    {
      title: '创建时间',
      dataIndex: 'createAt',
      width: 160,
      render: (_, record) => <div>{dayjs(record.createAt).format('YYYY-MM-DD HH:mm:ss')}</div>
    },
    {
      title: '操作',
      key: 'operation',
      align: 'center',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <PageOperations
          onEdit={() =>
            roleDrawerPros.onOpen({
              ...record,
              permissionCodes: record.permissions.map(el => el.code)
            })
          }
          editDisabled={record.systemic}
          deleteTitle={`确定删除[${record.name}]？`}
          onDelete={async () => {
            await sysRoleApi.del(record.id)
            message.success('删除成功！')
            reload()
          }}
          deleteDisabled={record.systemic}
        />
      )
    }
  ]

  return (
    <Card bordered={false} styles={{ body: { paddingBottom: 0 } }}>
      <PageQuery
        control={control}
        reset={reset}
        extras={
          <Button type="primary" onClick={() => roleDrawerPros.onOpen()}>
            新增
          </Button>
        }
      >
        <Form.Item label="角色名称" className="!mb-0">
          <Controller
            name="name"
            control={control}
            render={({ field }) => <Input allowClear placeholder="角色名称" autoComplete="off" {...field} />}
          />
        </Form.Item>
        <Form.Item label="状态" className="!mb-0">
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select style={{ width: 120 }} placeholder="选择状态" allowClear {...field}>
                {BasicStatusOptions.map(el => (
                  <Select.Option value={el.value} key={el.value}>
                    <Typography.Text type={el.color}>{el.label}</Typography.Text>
                  </Select.Option>
                ))}
              </Select>
            )}
          />
        </Form.Item>
      </PageQuery>

      <Table
        rowKey="id"
        scroll={{ x: 1000, y: 660 }}
        loading={listLoading}
        pagination={pagination}
        columns={columns}
        dataSource={list}
      />

      <RoleDrawer {...roleDrawerPros} onSuccess={reload} />
    </Card>
  )
}
