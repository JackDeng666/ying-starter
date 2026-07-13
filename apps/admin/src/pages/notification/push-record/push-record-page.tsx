import { Card, Input, Select, Space, Tag, Typography } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { Controller } from 'react-hook-form'
import dayjs from 'dayjs'

import { getOption } from '@ying/utils'
import { useDialogOpen } from '@ying/frontend/hooks'
import { ListPushRecordDto, ListPushTaskDto } from '@ying/dto'
import type { PushRecordEntity } from '@ying/entity'

import { notificationApi } from '@/api'
import { useQueryWithParams, useTable } from '@/hooks'
import { PageQuery } from '@/components/page-query'
import { JsonViewModal } from '@/components/json-view-modal'

import { PushRecordStatusOption, PushRecordStatusOptions } from './constant'

export default function Page() {
  const { control, resetParams, list, listLoading, pagination } = useTable<ListPushRecordDto, PushRecordEntity>({
    key: 'push-record',
    getList: notificationApi.listPushRecord,
    getListCount: notificationApi.listPushRecordCount
  })

  const { data: pushTasks, debounceSetParams } = useQueryWithParams({
    key: 'push-task-select-list',
    queryFn: async (params: ListPushTaskDto) => {
      const data = await notificationApi.listPushTask(params)
      return data.map(el => ({ label: el.name, value: el.id }))
    }
  })

  const jsonViewModalProps = useDialogOpen<object>()

  const columns: ColumnsType<PushRecordEntity> = [
    {
      title: '推送任务',
      width: 200,
      ellipsis: true,
      dataIndex: 'pushTask',
      render: (_, record) => record.pushTask.name
    },
    {
      title: '浏览用户ID',
      width: 300,
      ellipsis: true,
      dataIndex: 'visitorId'
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
        if (!_) return '-'
        let data = _
        try {
          data = JSON.parse(_)
        } catch {
          //
        }
        return <Typography.Link onClick={() => jsonViewModalProps.onOpen(data)}>查看</Typography.Link>
      }
    },
    {
      title: '推送内容',
      width: 140,
      ellipsis: true,
      align: 'center',
      dataIndex: 'pushData',
      render: _ => <Typography.Link onClick={() => jsonViewModalProps.onOpen(_)}>查看</Typography.Link>
    },
    {
      title: '创建时间',
      dataIndex: 'createAt',
      width: 160,
      render: (_, record) => dayjs(record.createAt).format('YYYY-MM-DD HH:mm:ss')
    }
  ]

  return (
    <Card variant="borderless">
      <PageQuery control={control} reset={resetParams}>
        <Controller
          control={control}
          name="visitorId"
          render={({ field }) => (
            <Space.Compact>
              <Space.Addon className="whitespace-nowrap">浏览用户ID</Space.Addon>
              <Input allowClear placeholder="请输入浏览用户ID" {...field} />
            </Space.Compact>
          )}
        />
        <Controller
          control={control}
          name="pushTaskId"
          render={({ field }) => (
            <Space.Compact>
              <Space.Addon>推送任务</Space.Addon>
              <Select
                style={{ width: 160 }}
                allowClear
                placeholder="请选择推送任务"
                filterOption={false}
                showSearch
                onSearch={name => debounceSetParams({ name, size: 100 })}
                options={pushTasks}
                {...field}
              />
            </Space.Compact>
          )}
        />
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <Space.Compact>
              <Space.Addon>推送状态</Space.Addon>
              <Select
                style={{ width: 160 }}
                allowClear
                placeholder="请选择推送状态"
                options={PushRecordStatusOptions}
                {...field}
              />
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

      <JsonViewModal {...jsonViewModalProps} />
    </Card>
  )
}
