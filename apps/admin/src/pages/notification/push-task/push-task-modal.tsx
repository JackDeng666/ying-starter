import { useCallback, useEffect } from 'react'
import { Form, Modal, Input, App, Select, Space } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'

import { CreatePushTaskDto, UpdatePushTaskDto } from '@ying/shared'
import { PushTaskEntity } from '@ying/shared/entities'
import { useDialogOpen, useFetch } from '@ying/fontend-shared/hooks'

import { notificationApi } from '@/admin/api'

import { defaultValues, DeviceTypeOptions, RegisterTypeOptions } from './constant'
import { TypeOption } from '@/admin/constant'

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

  const { data: pushTemplates, debounceRun: searchPushTemplate } = useFetch<TypeOption[], string>({
    func: useCallback(async name => {
      const list = await notificationApi.listPushTemplate({
        name,
        size: 20
      })
      return list.map(el => ({ label: el.name, value: el.id }))
    }, []),
    debounceTimeout: 500
  })

  const updateForm = useCallback(async () => {
    if (formValue) {
      const data = await notificationApi.getPushTask(formValue.id)
      reset(data)
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
      <Form form={form} labelCol={{ flex: '5rem' }} onFinish={handleSubmit(handlePost)}>
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
        <Form.Item label="触达用户">
          <Space>
            <Controller
              control={control}
              name="registerType"
              render={({ field }) => <Select style={{ width: 120 }} options={RegisterTypeOptions} {...field} />}
            />
            <Controller
              control={control}
              name="deviceType"
              render={({ field }) => <Select style={{ width: 120 }} options={DeviceTypeOptions} {...field} />}
            />
          </Space>
        </Form.Item>
        <Form.Item
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
                onSearch={searchPushTemplate}
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
