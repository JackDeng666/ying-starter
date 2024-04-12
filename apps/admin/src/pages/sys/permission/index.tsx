import { Button, Card, Popconfirm, message } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { useCallback, useMemo, useState } from 'react'

import { IconButton, Iconify, SvgIcon } from '@/components/icon'
import ProTag from '@/theme/antd/components/tag'

import { getOption } from '@ying/utils'

import { BasicStatus, PermissionType, CreateOrUpdatePermissionDto } from '@ying/shared'
import { BasicStatusOptions, BasicStatusOptionsType, PermissionOptions, PermissionOptionsType } from '@/constant'

import { permissionApi } from '@/api'
import { useApi } from '@ying/hooks'

import { PermissionDrawer, PermissionDrawerProps } from './permission-drawer'
import { SysPermissionEntity } from '@ying/shared/entities'

const defaultPermissionValue: Partial<CreateOrUpdatePermissionDto> = {
  code: undefined,
  parentCode: undefined,
  label: '',
  route: '',
  component: '',
  icon: '',
  frameSrc: '',
  noCache: false,
  sort: undefined,
  status: BasicStatus.ENABLE,
  type: PermissionType.CATALOGUE,
  remark: ''
}
export default function PermissionPage() {
  const {
    data,
    loading: listLoading,
    run: loadList
  } = useApi({
    func: useCallback(() => permissionApi.list(), [])
  })

  const list = useMemo(() => {
    function sort(list: SysPermissionEntity[]) {
      if (!list || !list.length) return undefined
      return list.map(el => ({ ...el, children: sort(el.children) })).sort((a, b) => b.sort - a.sort)
    }
    return sort(data)
  }, [data])

  const columns: ColumnsType<SysPermissionEntity> = [
    {
      title: '名称',
      dataIndex: 'label'
    },
    {
      title: '类型',
      dataIndex: 'type',
      align: 'center',
      width: 60,
      render: (_, record) => {
        const permission = getOption<PermissionOptionsType>(PermissionOptions, record.type)
        return <ProTag color={permission.color}>{permission.label}</ProTag>
      }
    },
    {
      title: '权限标识',
      dataIndex: 'code',
      ellipsis: true
    },
    {
      title: '图标',
      align: 'center',
      dataIndex: 'icon',
      width: 60,
      render: icon => {
        if (!icon) return ''
        if (icon.startsWith('ic')) {
          return <SvgIcon icon={icon} size={18} className="ant-menu-item-icon" />
        }
        return <Iconify icon={icon} size={18} className="ant-menu-item-icon" />
      }
    },
    {
      title: '组件',
      dataIndex: 'component'
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
    {
      title: '排序',
      dataIndex: 'sort',
      align: 'center',
      width: 60
    },
    {
      title: '操作',
      key: 'operation',
      align: 'center',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <div className="flex w-full justify-center text-gray">
          <IconButton onClick={() => onEdit(record)}>
            <Iconify icon="solar:pen-bold-duotone" size={18} />
          </IconButton>
          <Popconfirm
            title={`确定删除[${record.label}]？`}
            okText="确定"
            cancelText="取消"
            placement="left"
            onConfirm={async () => {
              await permissionApi.del(record.code)
              message.success('删除成功！')
              loadList()
            }}
          >
            <IconButton>
              <Iconify icon="mingcute:delete-2-fill" size={18} className="text-error" />
            </IconButton>
          </Popconfirm>
        </div>
      )
    }
  ]

  const [permissionDrawerProps, setPermissionDrawerProps] = useState<PermissionDrawerProps>({
    formValue: { ...defaultPermissionValue },
    title: '',
    show: false,
    onSuccess: () => {
      loadList()
      setPermissionDrawerProps(prev => ({ ...prev, show: false }))
    },
    onCancel: () => {
      setPermissionDrawerProps(prev => ({ ...prev, show: false }))
    }
  })

  const onCreate = () => {
    setPermissionDrawerProps(prev => ({
      ...prev,
      show: true,
      title: '新增权限',
      formValue: { ...defaultPermissionValue }
    }))
  }

  const onEdit = (formValue: SysPermissionEntity) => {
    setPermissionDrawerProps(prev => ({
      ...prev,
      show: true,
      title: '编辑权限',
      formValue
    }))
  }

  return (
    <Card bordered={false}>
      <div className="mb-4 w-full flex flex-wrap gap-2">
        <div className="flex-1 flex justify-end gap-2">
          <Button onClick={loadList}>刷新</Button>
          <Button type="primary" onClick={() => onCreate()}>
            新增
          </Button>
        </div>
      </div>

      <Table
        rowKey="code"
        scroll={{ x: 1000, y: 530 }}
        pagination={false}
        columns={columns}
        dataSource={list}
        loading={listLoading}
      />

      <PermissionDrawer {...permissionDrawerProps} />
    </Card>
  )
}
