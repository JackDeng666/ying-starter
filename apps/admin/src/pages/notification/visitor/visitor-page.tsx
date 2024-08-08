import { Card, Form, Input, Select, Tooltip, Typography } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { Controller, useForm } from 'react-hook-form'
import { useCallback, useEffect } from 'react'
import dayjs from 'dayjs'

import { debounce } from '@ying/utils'
import { useFetch } from '@ying/fontend-shared/hooks'

import { ListVisitorDto } from '@ying/shared'
import { VisitorEntity } from '@ying/shared/entities'

import { notificationApi, userApi } from '@/admin/api'
import { usePage } from '@/admin/hooks/use-page'
import { PageQuery } from '@/admin/components/page-query'
import { DeviceTypeOptions } from './constant'

export default function Page() {
  const { control, watch, reset, getValues } = useForm<ListVisitorDto>()

  const { list, listLoading, pagination, reload } = usePage({
    listApi: useCallback(
      ({ page, size }) =>
        notificationApi.listVisitor({
          ...getValues(),
          page,
          size
        }),
      [getValues]
    ),
    listCount: useCallback(
      () =>
        notificationApi.listVisitorCount({
          ...getValues()
        }),
      [getValues]
    )
  })

  useEffect(() => {
    const subscription = watch(debounce(reload, 500))
    return () => subscription.unsubscribe()
  }, [watch, reload])

  const { debounceRun: seacrhUsers, data: users } = useFetch({
    func: useCallback(async (name: string) => {
      const data = await userApi.list({ name, size: 20 })
      return data.map(el => ({ label: el.name, value: el.id }))
    }, []),
    debounceTimeout: 500
  })

  const columns: ColumnsType<VisitorEntity> = [
    {
      title: '浏览用户ID',
      width: 280,
      ellipsis: true,
      dataIndex: 'id'
    },
    {
      title: '语言',
      width: 120,
      ellipsis: true,
      align: 'center',
      dataIndex: 'language'
    },
    {
      title: '设备类型',
      width: 120,
      ellipsis: true,
      align: 'center',
      dataIndex: 'deviceType'
    },
    {
      title: 'UserAgent',
      width: 160,
      ellipsis: true,
      align: 'center',
      dataIndex: 'userAgent',
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
        if (!_) return '-'
        return (
          <Tooltip title={JSON.stringify(_)}>
            <Typography.Link>查看</Typography.Link>
          </Tooltip>
        )
      }
    },
    {
      title: '关联用户',
      width: 200,
      ellipsis: true,
      dataIndex: 'user',
      render(_, record) {
        if (!record.user) return
        return (
          <div>
            <p>
              ID: [{record.user.id}] 昵称: [{record.user.name}]
            </p>
            <p> {record.user.email}</p>
          </div>
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
          name="language"
          render={({ field }) => (
            <Form.Item label="语言" className="!mb-0">
              <Input allowClear placeholder="请输入语言" {...field} />
            </Form.Item>
          )}
        />
        <Controller
          control={control}
          name="deviceType"
          render={({ field }) => (
            <Form.Item label="设备类型" className="!mb-0">
              <Select
                allowClear
                style={{ width: 160 }}
                placeholder="请选择设备类型"
                options={DeviceTypeOptions}
                {...field}
              />
            </Form.Item>
          )}
        />
        <Controller
          control={control}
          name="userId"
          render={({ field }) => (
            <Form.Item label="用户" className="!mb-0">
              <Select
                allowClear
                style={{ width: 160 }}
                placeholder="请选择用户"
                showSearch
                filterOption={false}
                onSearch={seacrhUsers}
                options={users}
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
