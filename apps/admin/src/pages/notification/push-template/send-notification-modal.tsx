import { useEffect } from 'react'
import { Form, Modal, Input, message } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'

import { useDialogOpen } from '@ying/frontend/hooks'
import { SendPushTemplateDto } from '@ying/dto'
import { PushTemplateEntity } from '@ying/entity'

import { notificationApi } from '@/api'

const resolver = classValidatorResolver(SendPushTemplateDto)

export type SendNotificationProps = ReturnType<typeof useDialogOpen<PushTemplateEntity>>

export function SendNotificationModal({ open, formValue, onClose }: SendNotificationProps) {
  const [form] = Form.useForm()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue
  } = useForm<SendPushTemplateDto>({
    resolver
  })

  useEffect(() => {
    if (formValue?.id) {
      setValue('pushTemplateId', formValue.id)
    }
  }, [formValue, setValue])

  const handlePost = async (value: SendPushTemplateDto) => {
    await notificationApi.sendPushTemplate(value)
    message.success('发送通知成功')
  }

  return (
    <Modal title="发送通知" open={open} onOk={form.submit} onCancel={onClose} confirmLoading={isSubmitting}>
      <Form layout="vertical" form={form} onFinish={handleSubmit(handlePost)}>
        <Form.Item<SendPushTemplateDto>
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
