import { Button, Card, Input, Select, Space, Tag, Typography, message } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { Controller } from 'react-hook-form'
import dayjs from 'dayjs'

import { getOption } from '@ying/utils'
import type { ListRoleDto, UpdateRoleDto } from '@ying/dto'
import type { SysRoleEntity } from '@ying/entity'
import { useDialogOpen } from '@ying/frontend/hooks'

import { BasicStatusOptions, BasicStatusOption } from '@/constant'
import { useTable } from '@/hooks'
import { sysRoleApi } from '@/api'
import { PageQuery } from '@/components/page-query'
import { PageOperations } from '@/components/page-operations'

import { RoleDrawer } from './role-drawer'

export default function RolePage() {
  const { control, resetParams, list, listLoading, pagination, reload } = useTable<ListRoleDto, SysRoleEntity>({
    key: 'role',
    getList: sysRoleApi.list,
    getListCount: sysRoleApi.listCount
  })

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
    <Card variant="borderless">
      <PageQuery
        control={control}
        reset={resetParams}
        extras={
          <Button type="primary" onClick={() => roleDrawerPros.onOpen()}>
            新增
          </Button>
        }
      >
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Space.Compact>
              <Space.Addon className="whitespace-nowrap">角色名称</Space.Addon>
              <Input allowClear placeholder="角色名称" autoComplete="off" {...field} />
            </Space.Compact>
          )}
        />
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Space.Compact>
              <Space.Addon className="whitespace-nowrap">状态</Space.Addon>
              <Select style={{ width: 120 }} placeholder="选择状态" allowClear {...field}>
                {BasicStatusOptions.map(el => (
                  <Select.Option value={el.value} key={el.value}>
                    <Typography.Text type={el.color}>{el.label}</Typography.Text>
                  </Select.Option>
                ))}
              </Select>
            </Space.Compact>
          )}
        />
      </PageQuery>

      <Table
        rowKey="id"
        size="small"
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
