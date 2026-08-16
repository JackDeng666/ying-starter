import { App, Button, Input, Select, Space, Tag, Typography } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { Controller } from 'react-hook-form'
import dayjs from 'dayjs'

import { getOption } from '@ying/utils'
import type { ListSysUserDto, UpdateSysUserDto, UpdateSysUserPasswordDto } from '@ying/dto'
import type { SysUserEntity } from '@ying/entity'
import { useDialogOpen } from '@ying/frontend/hooks'

import { useThemeToken } from '@/hooks'
import { useQueryWithParams, useTable } from '@/hooks'
import { sysRoleApi, sysUserApi } from '@/api'
import { Page, PageQuery, PageOperations } from '@/layouts/page'
import { IconButton, Iconify } from '@/components/icon'
import { BasicStatusOptions, BasicStatusOption } from '@/constant'

import { UserDrawer } from './user-drawer'
import { ChangePassModal } from './change-pass-modal'

export default function UserPage() {
  const { message } = App.useApp()
  const { data: roles, debounceSetParams } = useQueryWithParams({
    key: 'role-select-list',
    queryFn: sysRoleApi.list,
    initialParams: { size: 100 }
  })

  const { control, resetParams, list, listLoading, pagination, reload } = useTable<ListSysUserDto, SysUserEntity>({
    key: 'sys-user',
    getList: sysUserApi.list,
    getListCount: sysUserApi.listCount
  })

  const changePassModalPros = useDialogOpen<UpdateSysUserPasswordDto>()
  const userDrawerProps = useDialogOpen<UpdateSysUserDto>()

  const { colorTextSecondary } = useThemeToken()
  const columns: ColumnsType<SysUserEntity> = [
    {
      title: '用户',
      width: 180,
      fixed: 'left',
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
        const option = getOption<BasicStatusOption>(BasicStatusOptions, status)
        return <Tag color={option.color}>{option.label}</Tag>
      }
    },
    {
      title: '角色',
      dataIndex: 'role',
      minWidth: 240,
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
    { title: '备注', dataIndex: 'remark', minWidth: 240 },
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
      width: 130,
      fixed: 'right',
      render: (_, record) => (
        <PageOperations
          extra={
            <IconButton
              onClick={() =>
                changePassModalPros.onOpen({
                  id: record.id,
                  password: ''
                })
              }
              disabled={record.roles.some(el => el.systemic)}
            >
              <Iconify icon="icon-park-outline:change" size={18} />
            </IconButton>
          }
          onEdit={() => userDrawerProps.onOpen({ ...record, roleIds: record.roles.map(el => el.id) })}
          editDisabled={record.roles.some(el => el.systemic)}
          deleteTitle={`确定删除[${record.account}]？`}
          onDelete={async () => {
            await sysUserApi.del(record.id)
            message.success('删除成功！')
            reload()
          }}
          deleteDisabled={record.roles.some(el => el.systemic)}
        />
      )
    }
  ]

  return (
    <Page
      header={
        <PageQuery
          control={control}
          reset={resetParams}
          extras={
            <Button type="primary" onClick={() => userDrawerProps.onOpen()}>
              新增
            </Button>
          }
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Space.Compact>
                <Space.Addon className="whitespace-nowrap">昵称</Space.Addon>
                <Input allowClear placeholder="昵称" autoComplete="off" {...field} />
              </Space.Compact>
            )}
          />
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Space.Compact>
                <Space.Addon className="whitespace-nowrap">账号</Space.Addon>
                <Input allowClear placeholder="账号" autoComplete="off" {...field} />
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
          <Controller
            name="roleIds"
            control={control}
            render={({ field }) => (
              <Space.Compact>
                <Space.Addon className="whitespace-nowrap">角色</Space.Addon>
                <Select
                  style={{ width: 280 }}
                  fieldNames={{
                    value: 'id',
                    label: 'name'
                  }}
                  filterOption={false}
                  mode="multiple"
                  placeholder="请选择角色"
                  options={roles}
                  onSearch={name => debounceSetParams({ name, size: 100 })}
                  allowClear
                  {...field}
                />
              </Space.Compact>
            )}
          />
        </PageQuery>
      }
      table={{
        rowKey: 'id',
        loading: listLoading,
        dataSource: list,
        columns
      }}
      body={
        <>
          <ChangePassModal {...changePassModalPros} />
          <UserDrawer {...userDrawerProps} onSuccess={reload} />
        </>
      }
      pagination={pagination}
    />
  )
}
