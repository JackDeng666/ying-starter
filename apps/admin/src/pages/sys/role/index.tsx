import { Button, Card, Popconfirm, message } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { IconButton, Iconify } from '@/admin/components/icon'
import ProTag from '@/admin/theme/antd/components/tag'

import { debounce, getOption } from '@ying/utils'
import { BasicStatus, ListRoleDto, UpdateRoleDto } from '@ying/shared'
import { SysRoleEntity } from '@ying/shared/entities'

import { BasicStatusOptions, BasicStatusOptionsType } from '@/admin/constant'
import { usePage } from '@/admin/hooks/use-page'
import { sysRoleApi } from '@/admin/api'

import { PageQuery } from './page-query'
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
        return <ProTag color={option.color}>{option.label}</ProTag>
      }
    },
    { title: '排序', dataIndex: 'sort', align: 'center', width: 60 },
    { title: '备注', dataIndex: 'remark' },
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

  return (
    <Card bordered={false} styles={{ body: { paddingBottom: 0 } }}>
      <PageQuery control={control} reset={reset}>
        <Button type="primary" onClick={() => onCreate()}>
          新增
        </Button>
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
