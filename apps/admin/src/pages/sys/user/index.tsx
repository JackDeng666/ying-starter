import { Button, Card, Form, Input, Popconfirm, Select, Tag, Typography, message } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { Controller, useForm } from 'react-hook-form'
import { useCallback, useEffect, useState } from 'react'
import dayjs from 'dayjs'

import { debounce, getOption } from '@ying/utils'
import { BasicStatus, ListSysUserDto, UpdateSysUserDto } from '@ying/shared'
import { SysUserEntity } from '@ying/shared/entities'

import { IconButton, Iconify } from '@/admin/components/icon'
import { useThemeToken } from '@/admin/theme/hooks'
import { usePage } from '@/admin/hooks/use-page'
import { sysUserApi } from '@/admin/api'
import { BasicStatusOptions, BasicStatusOptionsType } from '@/admin/constant'
import { PageQuery } from '@/admin/components/page-query'

import { UserDrawer, UserDrawerProps } from './user-drawer'
import { ChangePassModal, ChangePassModalProps } from './change-pass-modal'

const DEFAULE_USER_VALUE: Partial<UpdateSysUserDto> = {
  id: undefined,
  name: '',
  account: '',
  email: '',
  password: '',
  status: BasicStatus.ENABLE,
  roleIds: [],
  remark: undefined
}

export default function UserPage() {
  const { control, watch, reset, getValues } = useForm<ListSysUserDto>()

  const { list, listLoading, pagination, reload } = usePage({
    listApi: useCallback(
      ({ page, size }) =>
        sysUserApi.list({
          ...getValues(),
          page,
          size
        }),
      [getValues]
    ),
    listCount: useCallback(
      () =>
        sysUserApi.listCount({
          ...getValues()
        }),
      [getValues]
    )
  })

  useEffect(() => {
    const subscription = watch(debounce(reload, 500))
    return () => subscription.unsubscribe()
  }, [watch, reload])

  const [changePassModalPros, setChangePassModalPros] = useState<ChangePassModalProps>({
    formValue: {
      id: 0,
      password: ''
    },
    title: '',
    show: false,
    onSuccess: () => {
      setChangePassModalPros(prev => ({ ...prev, show: false }))
    },
    onCancel: () => {
      setChangePassModalPros(prev => ({ ...prev, show: false }))
    }
  })

  const updatePassword = (record: SysUserEntity) => {
    setChangePassModalPros(prev => ({
      ...prev,
      show: true,
      title: '修改密码',
      formValue: {
        id: record.id,
        password: ''
      }
    }))
  }

  const [userDrawerPros, setUserDrawerPros] = useState<UserDrawerProps>({
    formValue: { ...DEFAULE_USER_VALUE },
    title: '',
    show: false,
    onSuccess: () => {
      reload()
      setUserDrawerPros(prev => ({ ...prev, show: false }))
    },
    onCancel: () => {
      setUserDrawerPros(prev => ({ ...prev, show: false }))
    }
  })

  const onCreate = () => {
    setUserDrawerPros(prev => ({
      ...prev,
      show: true,
      title: '新增系统用户',
      formValue: {
        ...DEFAULE_USER_VALUE
      }
    }))
  }

  const onEdit = (formValue: SysUserEntity) => {
    setUserDrawerPros(prev => ({
      ...prev,
      show: true,
      title: '编辑系统用户',
      formValue: {
        ...formValue,
        roleIds: formValue.roles.map(el => el.id)
      }
    }))
  }

  const { colorTextSecondary } = useThemeToken()
  const columns: ColumnsType<SysUserEntity> = [
    {
      title: '用户',
      width: 240,
      render: (_, record) => {
        return (
          <div className="flex">
            <img alt="avatar" src={record.avatar?.url} className="h-10 w-10 rounded-full object-cover" />
            <div className="ml-2 flex flex-col">
              <span className="text-sm">{record.name}</span>
              <span style={{ color: colorTextSecondary }} className="text-xs">
                {record.account} {record.email}
              </span>
            </div>
          </div>
        )
      }
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
    {
      title: '角色',
      dataIndex: 'role',
      render: (_, record) => (
        <>
          {record.roles.map(el => (
            <Tag color="cyan" key={el.id}>
              {el.name}
            </Tag>
          ))}
        </>
      )
    },
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
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <div className="flex w-full justify-center gap-1 text-gray overflow-auto">
          <IconButton
            onClick={() => updatePassword(record)}
            disabled={record.roles.map(el => el.name).includes('Super Admin')}
          >
            <Iconify icon="icon-park-outline:change" size={18} />
          </IconButton>
          <IconButton onClick={() => onEdit(record)} disabled={record.roles.map(el => el.name).includes('Super Admin')}>
            <Iconify icon="solar:pen-bold-duotone" size={18} />
          </IconButton>
          <Popconfirm
            title={`确定删除[${record.account}]？`}
            okText="确定"
            cancelText="取消"
            placement="left"
            onConfirm={async () => {
              await sysUserApi.del(record.id)
              message.success('删除成功！')
              reload()
            }}
          >
            <IconButton disabled={record.roles.map(el => el.name).includes('Super Admin')}>
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
        <Form.Item label="名称" className="!mb-0">
          <Controller
            name="name"
            control={control}
            render={({ field }) => <Input allowClear placeholder="名称" autoComplete="off" {...field} />}
          />
        </Form.Item>
        <Form.Item label="账号" className="!mb-0">
          <Controller
            name="account"
            control={control}
            render={({ field }) => <Input allowClear placeholder="账号" autoComplete="off" {...field} />}
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

      <ChangePassModal {...changePassModalPros} />
      <UserDrawer {...userDrawerPros} />
    </Card>
  )
}
