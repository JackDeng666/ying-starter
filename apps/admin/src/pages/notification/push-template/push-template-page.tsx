import { App, Button, Card, Input, Space } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { Controller } from 'react-hook-form'
import { useEffect } from 'react'
import dayjs from 'dayjs'
import { useLocation } from 'react-router-dom'

import { useDialogOpen } from '@ying/frontend/hooks'
import { ListPushTemplateDto } from '@ying/dto'
import { ArticleEntity, PushTemplateEntity } from '@ying/entity'

import { IconButton, Iconify } from '@/components/icon'
import { PageQuery } from '@/components/page-query'
import { PageOperations } from '@/components/page-operations'
import { IntlShow } from '@/components/intl'
import { useTable } from '@/hooks'
import { notificationApi } from '@/api'

import { PushTemplateDrawer } from './push-template-drawer'
import { SendNotificationModal } from './send-notification-modal'

export default function Page() {
  const { message } = App.useApp()

  const { control, resetParams, list, listLoading, pagination, reload } = useTable<
    ListPushTemplateDto,
    PushTemplateEntity
  >({
    key: 'push-template',
    getList: notificationApi.listPushTemplate,
    getListCount: notificationApi.listPushTemplateCount
  })

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
      width: 130,
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
    <Card variant="borderless">
      <PageQuery
        control={control}
        reset={resetParams}
        extras={
          <Button type="primary" onClick={() => pushTemplateDrawerProps.onOpen()}>
            新增
          </Button>
        }
      >
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Space.Compact>
              <Space.Addon className="whitespace-nowrap">模板名称</Space.Addon>
              <Input allowClear placeholder="请输入模板名称" {...field} />
            </Space.Compact>
          )}
        />

        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <Space.Compact>
              <Space.Addon className="whitespace-nowrap">通知标题</Space.Addon>
              <Input allowClear placeholder="请输入通知标题" {...field} />
            </Space.Compact>
          )}
        />
      </PageQuery>

      <Table
        rowKey="id"
        size="middle"
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
