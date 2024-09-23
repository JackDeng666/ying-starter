import { App, Card, Form, Input, Select, Typography, Image, Button, Tag } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { Controller, useForm } from 'react-hook-form'
import { useCallback, useEffect } from 'react'
import dayjs from 'dayjs'

import { debounce, getOption } from '@ying/utils'
import { useDialogOpen } from '@ying/fontend-shared/hooks'
import { ListArticleDto } from '@ying/shared'
import { ArticleEntity } from '@ying/shared/entities'

import { PageQuery } from '@/admin/components/page-query'
import { PageOperations } from '@/admin/components/page-operations'
import { PromotionModal, TPromotionData } from '@/admin/components/promotion-modal'
import { IntlShow } from '@/admin/components/intl'
import { BasicStatusOption, BasicStatusOptions } from '@/admin/constant'
import { usePage } from '@/admin/hooks/use-page'
import { articleApi } from '@/admin/api'
import { useRouter } from '@/admin/router/hooks'
import { useConfig } from '@/admin/store'

import { ArticleDrawer } from './article-drawer'

export default function Page() {
  const router = useRouter()
  const { message } = App.useApp()
  const { control, watch, reset, getValues } = useForm<ListArticleDto>()

  const { list, listLoading, pagination, reload } = usePage({
    listApi: useCallback(
      ({ page, size }) =>
        articleApi.list({
          ...getValues(),
          page,
          size
        }),
      [getValues]
    ),
    listCount: useCallback(
      () =>
        articleApi.listCount({
          ...getValues()
        }),
      [getValues]
    )
  })

  useEffect(() => {
    const subscription = watch(debounce(reload, 500))
    return () => subscription.unsubscribe()
  }, [watch, reload])

  const { config } = useConfig()
  const articleDrawerProps = useDialogOpen<ArticleEntity>()
  const articlePromotionModalProps = useDialogOpen<TPromotionData>()

  const columns: ColumnsType<ArticleEntity> = [
    {
      title: '文章名称',
      ellipsis: true,
      dataIndex: 'name'
    },
    {
      title: '文章标题',
      ellipsis: true,
      dataIndex: 'title',
      render: (_, record) => <IntlShow value={record.title} />
    },
    {
      title: '封面',
      dataIndex: 'cover',
      align: 'center',
      width: 120,
      render: (_, record) => (
        <div className="fc !inline-flex w-[60px] h-[60px] overflow-hidden">
          <Image src={record.cover.url} className="rounded-sm" />
        </div>
      )
    },
    {
      title: '排序',
      width: 80,
      align: 'center',
      dataIndex: 'sort'
    },
    {
      title: '关键字',
      ellipsis: true,
      dataIndex: 'keywords',
      render: (_, record) => <div>{record.keywords.join('，')}</div>
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      width: 100,
      render: _ => {
        const option = getOption<BasicStatusOption>(BasicStatusOptions, _)
        return (
          <Tag className="cursor-pointer" color={option.color}>
            {option.label}
          </Tag>
        )
      }
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
      render: (_, record) => {
        return (
          <PageOperations
            onEdit={() => {
              articleDrawerProps.onOpen(record)
            }}
            onDelete={async () => {
              await articleApi.del(record.id)
              message.success('删除成功！')
              reload()
            }}
            ellipsisItems={[
              {
                key: 'promotion',
                label: '单页推广',
                onClick: () =>
                  articlePromotionModalProps.onOpen({
                    title: `推广-${record.name}`,
                    link: `${config.clientUrl}/article/${record.id}`
                  })
              },
              {
                key: 'copy',
                label: '复制到推送模板',
                onClick: () => router.push('/notification/push-template', { state: { type: 'setArticle', record } })
              }
            ]}
          />
        )
      }
    }
  ]

  return (
    <Card bordered={false} styles={{ body: { paddingBottom: 0 } }}>
      <PageQuery
        control={control}
        reset={reset}
        extras={
          <Button type="primary" onClick={() => articleDrawerProps.onOpen()}>
            新增
          </Button>
        }
      >
        <Form.Item label="文章名称" className="!mb-0">
          <Controller
            name="name"
            control={control}
            render={({ field }) => <Input allowClear placeholder="请输入文章名称" autoComplete="off" {...field} />}
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

      <ArticleDrawer {...articleDrawerProps} onSuccess={reload} />
      <PromotionModal {...articlePromotionModalProps} />
    </Card>
  )
}
