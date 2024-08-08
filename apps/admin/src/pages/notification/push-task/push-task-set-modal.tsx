import { useCallback, useEffect } from 'react'
import { Form, Modal, App, DatePicker } from 'antd'
import { Controller, useController, useForm } from 'react-hook-form'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import dayjs from 'dayjs'

import { SetPushTaskDto } from '@ying/shared'
import { PushTaskEntity } from '@ying/shared/entities'
import { useDialogOpen } from '@ying/fontend-shared/hooks'

import { notificationApi } from '@/admin/api'

export type PushTaskSetProps = ReturnType<typeof useDialogOpen<PushTaskEntity>> & {
  onSuccess: VoidFunction
}

export function PushTaskSetModal({ open, formValue, onSuccess, onClose }: PushTaskSetProps) {
  const title = '设置任务'
  const [form] = Form.useForm()
  const { message } = App.useApp()
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<SetPushTaskDto>({
    resolver: classValidatorResolver(SetPushTaskDto)
  })

  const { field: timeField } = useController({ control, name: 'time' })

  const updateForm = useCallback(async () => {
    if (formValue) {
      reset({ id: formValue.id, time: undefined })
    }
  }, [formValue, reset])

  useEffect(() => {
    updateForm()
  }, [updateForm])

  const handlePost = async (value: SetPushTaskDto) => {
    await notificationApi.setPushTask(value)
    message.success(`${title}成功`)
    onSuccess()
    onClose()
  }

  return (
    <Modal
      title={title}
      open={open}
      okText={timeField.value ? '定时推送' : '立即推送'}
      onOk={form.submit}
      onCancel={onClose}
      confirmLoading={isSubmitting}
    >
      <Form form={form} labelCol={{ flex: '5em' }} onFinish={handleSubmit(handlePost)}>
        <Controller
          name="time"
          control={control}
          render={({ field }) => (
            <Form.Item
              label="推送时间"
              validateStatus={errors.time ? 'error' : ''}
              help={errors.time && errors.time.message}
            >
              <DatePicker
                showTime
                allowClear
                placeholder="请选择推送时间"
                value={field.value ? dayjs(field.value) : undefined}
                onChange={date => {
                  if (!date) return field.onChange(undefined)
                  field.onChange(date.format('YYYY-MM-DD HH:mm:ss'))
                }}
              />
            </Form.Item>
          )}
        />
      </Form>
    </Modal>
  )
}
