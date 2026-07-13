import { App, Card, Input, Space } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { Controller } from 'react-hook-form'
import dayjs from 'dayjs'

import { ListFeedbackDto } from '@ying/dto'
import { FeedbackEntity } from '@ying/entity'

import { commonApi } from '@/api'
import { useTable } from '@/hooks'
import { PageQuery } from '@/components/page-query'
import { PageOperations } from '@/components/page-operations'

export default function FeedbackPage() {
  const { message } = App.useApp()

  const { control, resetParams, list, listLoading, pagination, reload } = useTable<ListFeedbackDto, FeedbackEntity>({
    key: 'feedback',
    getList: commonApi.listFeedback,
    getListCount: commonApi.listFeedbackCount
  })

  const columns: ColumnsType<FeedbackEntity> = [
    {
      title: '用户名称',
      width: 150,
      ellipsis: true,
      dataIndex: 'name',
      render: (_, record) => (
        <div>
          {record.lastName} {record.firstName}
        </div>
      )
    },
    {
      title: '邮箱',
      width: 200,
      ellipsis: true,
      dataIndex: 'email'
    },
    {
      title: '内容',
      ellipsis: true,
      dataIndex: 'content'
    },
    {
      title: '创建时间',
      dataIndex: 'createAt',
      width: 200,
      render: (_, record) => <div>{dayjs(record.createAt).format('YYYY-MM-DD HH:mm:ss')}</div>
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
            await commonApi.deleteFeedback(record.id)
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
          name="email"
          control={control}
          render={({ field }) => (
            <Space.Compact>
              <Space.Addon className="whitespace-nowrap">邮箱</Space.Addon>
              <Input allowClear placeholder="请输入邮箱" autoComplete="off" {...field} />
            </Space.Compact>
          )}
        />
      </PageQuery>

      <Table
        rowKey="id"
        size="middle"
        scroll={{ x: 1000, y: 500 }}
        loading={listLoading}
        pagination={pagination}
        columns={columns}
        dataSource={list}
      />
    </Card>
  )
}
