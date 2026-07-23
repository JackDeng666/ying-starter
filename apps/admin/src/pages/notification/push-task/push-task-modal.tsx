import { useCallback, useEffect } from 'react'
import { Form, Modal, Input, App, Select } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'

import { CreatePushTaskDto, ListPushTemplateDto, UpdatePushTaskDto } from '@ying/dto'
import { PushTaskEntity } from '@ying/entity'
import { useDialogOpen } from '@ying/frontend/hooks'

import { useQueryWithParams } from '@/hooks/use-query-with-params'
import { notificationApi } from '@/api'

import { defaultValues, DeviceTypeOptions } from './constant'

const createResolver = classValidatorResolver(CreatePushTaskDto)
const updateResolver = classValidatorResolver(UpdatePushTaskDto)

export type PushTaskModalProps = ReturnType<typeof useDialogOpen<PushTaskEntity>> & {
  onSuccess: VoidFunction
}

export function PushTaskModal({ open, formValue, onSuccess, onClose }: PushTaskModalProps) {
  const title = `${formValue ? '编辑' : '新增'}推送任务`
  const [form] = Form.useForm()
  const { message } = App.useApp()
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<CreatePushTaskDto & UpdatePushTaskDto>({
    resolver: formValue ? updateResolver : createResolver,
    defaultValues
  })

  const { data: pushTemplates, debounceSetParams } = useQueryWithParams({
    key: 'push-template-select-list',
    queryFn: async (params: ListPushTemplateDto) => {
      const list = await notificationApi.listPushTemplate(params)
      return list.map(el => ({ label: el.name, value: el.id }))
    }
  })

  const updateForm = useCallback(() => {
    if (formValue) {
      reset(formValue)
    } else {
      reset(defaultValues)
    }
  }, [formValue, reset])

  useEffect(() => {
    updateForm()
  }, [updateForm])

  const handlePost = async (value: CreatePushTaskDto & UpdatePushTaskDto) => {
    if (value.id) {
      await notificationApi.updatePushTask(value)
    } else {
      await notificationApi.createPushTask(value)
    }
    message.success(`${title}成功`)
    onSuccess()
    onClose()
  }

  return (
    <Modal title={title} width={660} open={open} onOk={form.submit} onCancel={onClose} confirmLoading={isSubmitting}>
      <Form layout="vertical" form={form} onFinish={handleSubmit(handlePost)}>
        <Form.Item
          label="任务名称"
          required
          validateStatus={errors.name ? 'error' : ''}
          help={errors.name && errors.name.message}
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => <Input allowClear placeholder="请输入任务名称" {...field} />}
          />
        </Form.Item>
        <Form.Item label="触达设备">
          <Controller
            control={control}
            name="deviceType"
            render={({ field }) => <Select placeholder="全部" allowClear options={DeviceTypeOptions} {...field} />}
          />
        </Form.Item>
        <Form.Item
          required
          label="推送模板"
          validateStatus={errors.pushTemplateId ? 'error' : ''}
          help={errors.pushTemplateId && errors.pushTemplateId.message}
        >
          <Controller
            name="pushTemplateId"
            control={control}
            render={({ field }) => (
              <Select
                filterOption={false}
                showSearch
                onSearch={name => debounceSetParams({ name, size: 100 })}
                options={pushTemplates}
                placeholder="请选择推送模板"
                {...field}
              />
            )}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
