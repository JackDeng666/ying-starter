import { App, Card, Input, Select, Space, Tooltip, Typography } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { Controller } from 'react-hook-form'
import dayjs from 'dayjs'

import { useDialogOpen } from '@ying/frontend/hooks'
import { ListVisitorDto } from '@ying/dto'
import { VisitorEntity } from '@ying/entity'

import { notificationApi } from '@/api'
import { useTable } from '@/hooks'
import { PageQuery } from '@/components/page-query'
import { PageOperations } from '@/components/page-operations'
import { JsonViewModal } from '@/components/json-view-modal'

import { DeviceTypeOptions } from './constant'

export default function Page() {
  const { control, resetParams, list, listLoading, pagination, reload } = useTable<ListVisitorDto, VisitorEntity>({
    key: 'visitor',
    getList: notificationApi.listVisitor,
    getListCount: notificationApi.listVisitorCount
  })

  const { message } = App.useApp()
  const jsonViewModalProps = useDialogOpen<object>()

  const columns: ColumnsType<VisitorEntity> = [
    {
      title: '浏览用户ID',
      width: 280,
      ellipsis: true,
      dataIndex: 'visitorId'
    },
    {
      title: '语言',
      width: 120,
      ellipsis: true,
      dataIndex: 'languages',
      render: (_, record) => record.languages.join(',')
    },
    {
      title: '关联用户',
      width: 200,
      ellipsis: true,
      dataIndex: 'users',
      render(_, record) {
        if (!record.users) return '-'
        return (
          <div>
            {record.users.map(user => (
              <div className="text-xs" key={user.id}>
                {user.name}, {user.email}
              </div>
            ))}
          </div>
        )
      }
    },
    {
      title: '设备类型',
      width: 100,
      ellipsis: true,
      align: 'center',
      dataIndex: 'deviceType'
    },
    {
      title: 'UserAgent',
      width: 160,
      ellipsis: true,
      dataIndex: 'userAgent',
      render: _ => (
        <Tooltip title={_} placement="topLeft">
          {_}
        </Tooltip>
      )
    },
    {
      title: 'pushSubscription',
      width: 160,
      ellipsis: true,
      align: 'center',
      dataIndex: 'pushSubscription',
      render(_) {
        if (!_) return '-'
        return <Typography.Link onClick={() => jsonViewModalProps.onOpen(_)}>查看</Typography.Link>
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createAt',
      width: 160,
      render: (_, record) => dayjs(record.createAt).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '操作',
      key: 'operation',
      align: 'center',
      width: 80,
      fixed: 'right',
      render: (_, record) => (
        <PageOperations
          deleteTitle="确定删除？"
          onDelete={async () => {
            await notificationApi.deleteVisitor(record.visitorId)
            message.success('删除成功！')
            reload()
          }}
        />
      )
    }
  ]

  return (
    <Card variant="borderless">
      <PageQuery control={control} reset={resetParams}>
        <Controller
          control={control}
          name="language"
          render={({ field }) => (
            <Space.Compact>
              <Space.Addon className="whitespace-nowrap">语言</Space.Addon>
              <Input allowClear placeholder="请输入语言" {...field} />
            </Space.Compact>
          )}
        />
        <Controller
          control={control}
          name="deviceType"
          render={({ field }) => (
            <Space.Compact>
              <Space.Addon>设备类型</Space.Addon>
              <Select
                allowClear
                style={{ width: 160 }}
                placeholder="请选择设备类型"
                options={DeviceTypeOptions}
                {...field}
              />
            </Space.Compact>
          )}
        />
      </PageQuery>

      <Table
        rowKey="visitorId"
        size="middle"
        scroll={{ x: 1000, y: 660 }}
        loading={listLoading}
        pagination={pagination}
        columns={columns}
        dataSource={list}
      />

      <JsonViewModal {...jsonViewModalProps} />
    </Card>
  )
}
