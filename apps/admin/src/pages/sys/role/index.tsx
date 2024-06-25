import { Button, Card, Form, Input, Popconfirm, Select, Tag, Typography, message } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import dayjs from 'dayjs'

import { debounce, getOption } from '@ying/utils'
import { BasicStatus, ListRoleDto, UpdateRoleDto } from '@ying/shared'
import { SysRoleEntity } from '@ying/shared/entities'

import { BasicStatusOptions, BasicStatusOptionsType } from '@/admin/constant'
import { usePage } from '@/admin/hooks/use-page'
import { sysRoleApi } from '@/admin/api'
import { PageQuery } from '@/admin/components/page-query'
import { IconButton, Iconify } from '@/admin/components/icon'

import { RoleDrawer, RoleDrawerProps } from './role-drawer'

const DEFAULE_ROLE_VALUE: Partial<UpdateRoleDto> = {
  id: undefined,
  name: '',
  status: BasicStatus.ENABLE,
  sort: undefined,
  remark: '',
  permissionCodes: []
}

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

  const [roleDrawerPros, setRoleDrawerPros] = useState<RoleDrawerProps>({
    formValue: { ...DEFAULE_ROLE_VALUE },
    title: '',
    show: false,
    onSuccess: () => {
      reload()
      setRoleDrawerPros(prev => ({ ...prev, show: false }))
    },
    onCancel: () => {
      setRoleDrawerPros(prev => ({ ...prev, show: false }))
    }
  })

  const onCreate = () => {
    setRoleDrawerPros(prev => ({
      ...prev,
      show: true,
      title: '新增角色',
      formValue: {
        ...DEFAULE_ROLE_VALUE
      }
    }))
  }

  const onEdit = (formValue: SysRoleEntity) => {
    setRoleDrawerPros(prev => ({
      ...prev,
      show: true,
      title: '编辑角色',
      formValue: {
        ...formValue,
        permissionCodes: formValue.permissions.map(el => el.code)
      }
    }))
  }

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
        const option = getOption<BasicStatusOptionsType>(BasicStatusOptions, status)
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
        <div className="flex w-full justify-center gap-1 text-gray">
          <IconButton onClick={() => onEdit(record)} disabled={record.systemic}>
            <Iconify icon="solar:pen-bold-duotone" size={18} />
          </IconButton>
          <Popconfirm
            title={`确定删除[${record.name}]？`}
            okText="确定"
            cancelText="取消"
            placement="left"
            onConfirm={async () => {
              await sysRoleApi.del(record.id)
              message.success('删除成功！')
              reload()
            }}
          >
            <IconButton disabled={record.systemic}>
              <Iconify icon="mingcute:delete-2-fill" size={18} className="text-error" />
            </IconButton>
          </Popconfirm>
        </div>
      )
    }
  ]

  return (
    <Card bordered={false} styles={{ body: { paddingBottom: 0 } }}>
      <PageQuery
        control={control}
        reset={reset}
        extras={
          <Button type="primary" onClick={() => onCreate()}>
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
        scroll={{ x: 1000, y: 500 }}
        loading={listLoading}
        pagination={pagination}
        columns={columns}
        dataSource={list}
      />

      <RoleDrawer {...roleDrawerPros} />
    </Card>
  )
}
