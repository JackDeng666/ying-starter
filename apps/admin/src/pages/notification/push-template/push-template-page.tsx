import { App, Button, Card, Form, Input } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { Controller, useForm } from 'react-hook-form'
import { useCallback, useEffect } from 'react'
import dayjs from 'dayjs'
import { useLocation } from 'react-router-dom'

import { debounce } from '@ying/utils'
import { useDialogOpen } from '@ying/fontend-shared/hooks'

import { ListPushTemplateDto } from '@ying/shared'
import { ArticleEntity, PushTemplateEntity } from '@ying/shared/entities'

import { IconButton, Iconify } from '@/admin/components/icon'
import { usePage } from '@/admin/hooks/use-page'
import { notificationApi } from '@/admin/api'
import { PageQuery } from '@/admin/components/page-query'
import { PageOperations } from '@/admin/components/page-operations'
import { IntlShow } from '@/admin/components/intl'

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

  const pushTemplateDrawerProps = useDialogOpen<Partial<PushTemplateEntity>>()
  const sendNotificationModalProps = useDialogOpen<PushTemplateEntity>()

  const location = useLocation()
  const { onOpen: openPushTemplateDrawer } = pushTemplateDrawerProps
  useEffect(() => {
    const state = location.state
    if (state) {
      if (state.type === 'setArticle') {
        const record = state.record as ArticleEntity
        openPushTemplateDrawer({
          name: record.name,
          title: record.title,
          link: `${import.meta.env.VITE_APP_CLIENT_URL}/article/${record.id}`,
          image: record.cover
        })
      }
    }
  }, [location, openPushTemplateDrawer])

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
      dataIndex: 'title',
      render: (_, record) => <IntlShow value={record.title} />
    },
    {
      title: '内容',
      ellipsis: true,
      dataIndex: 'body',
      render: (_, record) => <IntlShow value={record.body} />
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
        <PageOperations
          extra={
            <IconButton onClick={() => sendNotificationModalProps.onOpen(record)}>
              <Iconify icon="solar:card-send-bold-duotone" size={18} />
            </IconButton>
          }
          onEdit={() => pushTemplateDrawerProps.onOpen(record)}
          deleteTitle={`确定删除【${record.name}】？`}
          onDelete={async () => {
            await notificationApi.deletePushTemplate(record.id)
            message.success('删除成功！')
            reload()
          }}
        />
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
        scroll={{ x: 1000, y: 660 }}
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
