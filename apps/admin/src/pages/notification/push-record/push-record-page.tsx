import { Card, Form, Input, Select, Tag, Tooltip, Typography } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { Controller, useForm } from 'react-hook-form'
import { useCallback, useEffect } from 'react'
import dayjs from 'dayjs'

import { debounce, getOption } from '@ying/utils'
import { useFetch } from '@ying/fontend-shared/hooks'

import { ListPushRecordDto } from '@ying/shared'
import { PushRecordEntity } from '@ying/shared/entities'

import { notificationApi } from '@/admin/api'
import { usePage } from '@/admin/hooks/use-page'
import { PageQuery } from '@/admin/components/page-query'
import { PushRecordStatusOption, PushRecordStatusOptions } from './constant'

export default function Page() {
  const { control, watch, reset, getValues } = useForm<ListPushRecordDto>()

  const { list, listLoading, pagination, reload } = usePage({
    listApi: useCallback(
      ({ page, size }) =>
        notificationApi.listPushRecord({
          ...getValues(),
          page,
          size
        }),
      [getValues]
    ),
    listCount: useCallback(
      () =>
        notificationApi.listPushRecordCount({
          ...getValues()
        }),
      [getValues]
    )
  })

  useEffect(() => {
    const subscription = watch(debounce(reload, 500))
    return () => subscription.unsubscribe()
  }, [watch, reload])

  const { debounceRun: seacrhPushTasks, data: pushTasks } = useFetch({
    func: useCallback(async (name: string) => {
      const data = await notificationApi.listPushTask({ name, size: 20 })
      return data.map(el => ({ label: el.name, value: el.id }))
    }, []),
    debounceTimeout: 500
  })

  const columns: ColumnsType<PushRecordEntity> = [
    {
      title: '浏览用户ID',
      width: 200,
      ellipsis: true,
      dataIndex: 'visitorId'
    },
    {
      title: '推送任务ID',
      width: 120,
      ellipsis: true,
      dataIndex: 'pushTaskId'
    },
    {
      title: '是否点击',
      width: 120,
      ellipsis: true,
      align: 'center',
      dataIndex: 'clicked',
      render: _ => (_ ? <Tag color="success">已点击</Tag> : <Tag>未点击</Tag>)
    },
    {
      title: '推送状态',
      width: 120,
      ellipsis: true,
      align: 'center',
      dataIndex: 'status',
      render: _ => {
        const option = getOption<PushRecordStatusOption>(PushRecordStatusOptions, _)
        return <Tag color={option.color}>{option.label}</Tag>
      }
    },
    {
      title: '推送结果',
      width: 160,
      ellipsis: true,
      align: 'center',
      dataIndex: 'pushResult',
      render(_) {
        return (
          <Tooltip title={_}>
            <Typography.Link>查看</Typography.Link>
          </Tooltip>
        )
      }
    },
    {
      title: 'pushSubscription',
      width: 160,
      ellipsis: true,
      align: 'center',
      dataIndex: 'pushSubscription',
      render(_) {
        return (
          <Tooltip title={_}>
            <Typography.Link>查看</Typography.Link>
          </Tooltip>
        )
      }
    },
    {
      title: '推送内容',
      width: 140,
      ellipsis: true,
      align: 'center',
      dataIndex: 'pushTemplate',
      render(_) {
        return (
          <Tooltip title={_}>
            <Typography.Link>查看</Typography.Link>
          </Tooltip>
        )
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createAt',
      width: 160,
      render: (_, record) => dayjs(record.createAt).format('YYYY-MM-DD HH:mm:ss')
    }
  ]

  return (
    <Card bordered={false} styles={{ body: { paddingBottom: 0 } }}>
      <PageQuery control={control} reset={reset}>
        <Controller
          control={control}
          name="visitorId"
          render={({ field }) => (
            <Form.Item label="浏览用户ID" className="!mb-0">
              <Input allowClear placeholder="请输入浏览用户ID" {...field} />
            </Form.Item>
          )}
        />
        <Controller
          control={control}
          name="pushTaskId"
          render={({ field }) => (
            <Form.Item label="推送任务" className="!mb-0">
              <Select
                style={{ width: 160 }}
                allowClear
                placeholder="请选择推送任务"
                filterOption={false}
                showSearch
                onSearch={seacrhPushTasks}
                options={pushTasks}
                {...field}
              />
            </Form.Item>
          )}
        />
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <Form.Item label="推送状态" className="!mb-0">
              <Select
                style={{ width: 160 }}
                allowClear
                placeholder="请选择推送状态"
                options={PushRecordStatusOptions}
                {...field}
              />
            </Form.Item>
          )}
        />
      </PageQuery>

      <Table
        rowKey="id"
        scroll={{ x: 1000, y: 660 }}
        loading={listLoading}
        pagination={pagination}
        columns={columns}
        dataSource={list}
      />
    </Card>
  )
}
