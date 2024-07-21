import { App, Card, Form, Input, Popconfirm } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { Controller, useForm } from 'react-hook-form'
import { useCallback, useEffect } from 'react'
import dayjs from 'dayjs'

import { debounce } from '@ying/utils'

import { ListFeedbackDto } from '@ying/shared'
import { FeedbackEntity } from '@ying/shared/entities'

import { IconButton, Iconify } from '@/admin/components/icon'
import { usePage } from '@/admin/hooks/use-page'
import { commonApi } from '@/admin/api'
import { PageQuery } from '@/admin/components/page-query'

export default function Page() {
  const { message } = App.useApp()
  const { control, watch, reset, getValues } = useForm<ListFeedbackDto>()

  const { list, listLoading, pagination, reload } = usePage({
    listApi: useCallback(
      ({ page, size }) =>
        commonApi.listFeedback({
          ...getValues(),
          page,
          size
        }),
      [getValues]
    ),
    listCount: useCallback(
      () =>
        commonApi.listFeedbackCount({
          ...getValues()
        }),
      [getValues]
    )
  })

  useEffect(() => {
    const subscription = watch(debounce(reload, 500))
    return () => subscription.unsubscribe()
  }, [watch, reload])

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
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <div className="flex w-full justify-center gap-1 text-gray">
          <Popconfirm
            title={`确定删除？`}
            okText="确定"
            cancelText="取消"
            placement="left"
            onConfirm={async () => {
              await commonApi.deleteFeedback(record.id)
              message.success('删除成功！')
              reload()
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

  return (
    <Card bordered={false} styles={{ body: { paddingBottom: 0 } }}>
      <PageQuery control={control} reset={reset}>
        <Form.Item label="邮箱" className="!mb-0">
          <Controller
            name="email"
            control={control}
            render={({ field }) => <Input allowClear placeholder="请输入邮箱" autoComplete="off" {...field} />}
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
    </Card>
  )
}
