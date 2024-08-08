import { Form, Modal, Input, message } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'

import { useDialogOpen } from '@ying/fontend-shared/hooks'
import { SendNotificationDto } from '@ying/shared'
import { PushTemplateEntity } from '@ying/shared/entities'

import { notificationApi } from '@/admin/api'
import { useEffect } from 'react'

const resolver = classValidatorResolver(SendNotificationDto)

export type SendNotificationProps = ReturnType<typeof useDialogOpen<PushTemplateEntity>>

export function SendNotificationModal({ open, formValue, onClose }: SendNotificationProps) {
  const [form] = Form.useForm()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue
  } = useForm<SendNotificationDto>({
    resolver
  })

  useEffect(() => {
    if (formValue?.id) {
      setValue('pushTemplateId', formValue.id)
    }
  }, [formValue, setValue])

  const handlePost = async (value: SendNotificationDto) => {
    try {
      await notificationApi.sendNotice(value)
      message.success('发送通知成功')
    } catch (error) {}
  }

  return (
    <Modal title="发送通知" open={open} onOk={form.submit} onCancel={onClose} confirmLoading={isSubmitting}>
      <Form form={form} labelCol={{ flex: '7em' }} onFinish={handleSubmit(handlePost)}>
        <Form.Item<SendNotificationDto>
          name="visitorId"
          label="浏览用户ID"
          required
          validateStatus={errors.visitorId ? 'error' : ''}
          help={errors.visitorId && errors.visitorId.message}
        >
          <Controller
            name="visitorId"
            control={control}
            render={({ field }) => <Input allowClear placeholder="请输入浏览用户ID" {...field} />}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
