import { App, Button, Card, Form, Input, Popconfirm } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { Controller, useForm } from 'react-hook-form'
import { useCallback, useEffect } from 'react'
import dayjs from 'dayjs'

import { debounce } from '@ying/utils'
import { useDialogOpen } from '@ying/fontend-shared/hooks'

import { ListPushTemplateDto } from '@ying/shared'
import { PushTemplateEntity } from '@ying/shared/entities'

import { IconButton, Iconify } from '@/admin/components/icon'
import { usePage } from '@/admin/hooks/use-page'
import { notificationApi } from '@/admin/api'
import { PageQuery } from '@/admin/components/page-query'

import { PushTemplateDrawer } from './push-template-drawer'
import { SendNotificationModal } from './send-notification-modal'

export default function Page() {
  const { message } = App.useApp()
  const { control, watch, reset, getValues } = useForm<ListPushTemplateDto>()

  const { list, listLoading, pagination, reload } = usePage({
    listApi: useCallback(
      ({ page, size }) =>
        notificationApi.listPushTemplate({
          ...getValues(),
          page,
          size
        }),
      [getValues]
    ),
    listCount: useCallback(
      () =>
        notificationApi.listPushTemplateCount({
          ...getValues()
        }),
      [getValues]
    )
  })

  useEffect(() => {
    const subscription = watch(debounce(reload, 500))
    return () => subscription.unsubscribe()
  }, [watch, reload])

  const pushTemplateDrawerProps = useDialogOpen<PushTemplateEntity>()
  const sendNotificationModalProps = useDialogOpen<PushTemplateEntity>()

  const columns: ColumnsType<PushTemplateEntity> = [
    {
      title: '模板名称',
      width: 200,
      ellipsis: true,
      dataIndex: 'name'
    },
    {
      title: '通知标题',
      width: 300,
      ellipsis: true,
      dataIndex: 'title'
    },
    {
      title: '内容',
      ellipsis: true,
      dataIndex: 'body'
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
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <div className="flex w-full justify-center gap-1 text-gray">
          <IconButton
            onClick={() => {
              sendNotificationModalProps.onOpen(record)
            }}
          >
            <Iconify icon="solar:card-send-bold-duotone" size={18} />
          </IconButton>
          <IconButton
            onClick={() => {
              pushTemplateDrawerProps.onOpen(record)
            }}
          >
            <Iconify icon="solar:pen-bold-duotone" size={18} />
          </IconButton>
          <Popconfirm
            title={`确定删除【${record.name}】？`}
            okText="确定"
            cancelText="取消"
            placement="left"
            onConfirm={async () => {
              await notificationApi.deletePushTemplate(record.id)
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
      <PageQuery
        control={control}
        reset={reset}
        extras={
          <Button type="primary" onClick={() => pushTemplateDrawerProps.onOpen()}>
            新增
          </Button>
        }
      >
        <Form.Item label="模板名称" className="!mb-0">
          <Controller
            name="name"
            control={control}
            render={({ field }) => <Input allowClear placeholder="请输入模板名称" {...field} />}
          />
        </Form.Item>
        <Form.Item label="通知标题" className="!mb-0">
          <Controller
            name="title"
            control={control}
            render={({ field }) => <Input allowClear placeholder="请输入通知标题" {...field} />}
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

      <PushTemplateDrawer {...pushTemplateDrawerProps} onSuccess={reload} />
      <SendNotificationModal {...sendNotificationModalProps} />
    </Card>
  )
}
