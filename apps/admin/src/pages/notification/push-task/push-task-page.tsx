import { App, Button, Card, Form, Input, Popconfirm, Typography } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { Controller, useForm } from 'react-hook-form'
import { useCallback, useEffect } from 'react'
import dayjs from 'dayjs'

import { debounce, getOption } from '@ying/utils'
import { useDialogOpen } from '@ying/fontend-shared/hooks'

import { ListPushTaskDto, PushTaskStatus } from '@ying/shared'
import { PushTaskEntity } from '@ying/shared/entities'

import { notificationApi } from '@/admin/api'
import { usePage } from '@/admin/hooks/use-page'
import { IconButton, Iconify } from '@/admin/components/icon'
import { PageQuery } from '@/admin/components/page-query'
import { PageOperations } from '@/admin/components/page-operations'

import {
  DeviceTypeOption,
  DeviceTypeOptions,
  PushTaskStatusOption,
  PushTaskStatusOptions,
  RegisterTypeOption,
  RegisterTypeOptions
} from './constant'
import { PushTaskModal } from './push-task-modal'
import { PushTaskSetModal } from './push-task-set-modal'

export default function Page() {
  const { message } = App.useApp()
  const { control, watch, reset, getValues } = useForm<ListPushTaskDto>()

  const { list, listLoading, pagination, reload } = usePage({
    listApi: useCallback(
      ({ page, size }) =>
        notificationApi.listPushTask({
          ...getValues(),
          page,
          size
        }),
      [getValues]
    ),
    listCount: useCallback(
      () =>
        notificationApi.listPushTaskCount({
          ...getValues()
        }),
      [getValues]
    )
  })

  useEffect(() => {
    const subscription = watch(debounce(reload, 500))
    return () => subscription.unsubscribe()
  }, [watch, reload])

  const pushTaskModalProps = useDialogOpen<PushTaskEntity>()
  const pushTaskSetModalProps = useDialogOpen<PushTaskEntity>()

  const columns: ColumnsType<PushTaskEntity> = [
    {
      title: '任务ID',
      width: 80,
      ellipsis: true,
      align: 'center',
      dataIndex: 'id'
    },
    {
      title: '任务名称',
      width: 200,
      ellipsis: true,
      dataIndex: 'name'
    },
    {
      title: '用户类型',
      width: 120,
      ellipsis: true,
      align: 'center',
      dataIndex: 'registerType',
      render: _ => getOption<RegisterTypeOption>(RegisterTypeOptions, _)?.label
    },
    {
      title: '设备类型',
      width: 120,
      ellipsis: true,
      align: 'center',
      dataIndex: 'deviceType',
      render: _ => getOption<DeviceTypeOption>(DeviceTypeOptions, _)?.label
    },
    {
      title: '推送任务',
      ellipsis: true,
      width: 300,
      dataIndex: 'pushTemplate',
      render(_, record) {
        return (
          <div>
            <p>模板ID：{record.pushTemplate.id}</p>
            <p>模板名称：{record.pushTemplate.name}</p>
          </div>
        )
      }
    },
    {
      title: '推送状态',
      width: 160,
      ellipsis: true,
      dataIndex: 'status',
      render(_, record) {
        const label = getOption<PushTaskStatusOption>(PushTaskStatusOptions, record.status)?.label
        const isWaitExecute = record.status === PushTaskStatus.WaitExecute
        return (
          <div>
            {label}
            {isWaitExecute && (
              <>
                <p>
                  推送时间{' '}
                  <Popconfirm
                    title={`确定取消推送【${record.name}】？`}
                    okText="确定"
                    cancelText="取消"
                    onConfirm={async () => {
                      await notificationApi.stopTimingPushTask(record.id)
                      message.success('取消成功！')
                      reload()
                    }}
                  >
                    <Typography.Link>取消推送</Typography.Link>
                  </Popconfirm>
                </p>
                <p>{dayjs(record.time).format('YYYY-MM-DD HH:mm:ss')}</p>
              </>
            )}
          </div>
        )
      }
    },
    {
      title: '任务状态',
      width: 160,
      ellipsis: true,
      render(_, record) {
        return (
          <div>
            <div>
              <span>推送中：{record.taskStatus.pushing} </span>
              <span>已失败：{record.taskStatus.fail}</span>
            </div>
            <div>
              <span>已成功：{record.taskStatus.success} </span>
              <span>点击数：{record.taskStatus.click}</span>
            </div>
          </div>
        )
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
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <PageOperations
          extra={
            <IconButton
              onClick={() => pushTaskSetModalProps.onOpen(record)}
              disabled={record.status >= PushTaskStatus.WaitExecute}
            >
              <Iconify icon="solar:upload-twice-square-bold-duotone" size={18} />
            </IconButton>
          }
          onEdit={() => pushTaskModalProps.onOpen(record)}
          editDisabled={record.status !== PushTaskStatus.Wait}
          deleteTitle={`确定删除【${record.name}】？`}
          onDelete={async () => {
            await notificationApi.deletePushTask(record.id)
            message.success('删除成功！')
            reload()
          }}
          deleteDisabled={record.status === PushTaskStatus.WaitExecute || record.status === PushTaskStatus.Executing}
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
          <Button type="primary" onClick={() => pushTaskModalProps.onOpen()}>
            新增
          </Button>
        }
      >
        <Form.Item label="任务名称" className="!mb-0">
          <Controller
            name="name"
            control={control}
            render={({ field }) => <Input allowClear placeholder="请输入任务名称" {...field} />}
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

      <PushTaskModal {...pushTaskModalProps} onSuccess={reload} />
      <PushTaskSetModal {...pushTaskSetModalProps} onSuccess={reload} />
    </Card>
  )
}
