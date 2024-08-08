import { useCallback, useEffect, useState } from 'react'
import { Form, Drawer, Input, Button, App } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'

import { CreatePushTemplateDto, UpdatePushTemplateDto } from '@ying/shared'
import { FileEntity, PushTemplateEntity } from '@ying/shared/entities'
import { useDialogOpen } from '@ying/fontend-shared/hooks'

import { notificationApi } from '@/admin/api'
import { SelectImage } from '@/admin/components/image-tool/select-image'
import { FormList } from '@/admin/components/form/form-list'

const createResolver = classValidatorResolver(CreatePushTemplateDto)
const updateResolver = classValidatorResolver(UpdatePushTemplateDto)

export type PushTemplateDrawerProps = ReturnType<typeof useDialogOpen<PushTemplateEntity>> & {
  onSuccess: VoidFunction
}

const defaultValue: CreatePushTemplateDto = {
  name: undefined,
  title: undefined,
  link: undefined,
  body: undefined,
  imageId: undefined,
  actions: undefined
}

export function PushTemplateDrawer({ open, formValue, onSuccess, onClose }: PushTemplateDrawerProps) {
  const title = `${formValue ? '编辑' : '新增'}推送模板`
  const [form] = Form.useForm()
  const { message } = App.useApp()
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<CreatePushTemplateDto & UpdatePushTemplateDto>({
    resolver: formValue ? updateResolver : createResolver,
    defaultValues: defaultValue
  })

  const [image, setImage] = useState<FileEntity>()

  const updateForm = useCallback(async () => {
    if (formValue) {
      const data = await notificationApi.getPushTemplate(formValue.id)
      reset(data)
      setImage(data.image)
    } else {
      reset(defaultValue)
      setImage(undefined)
    }
  }, [formValue, reset])

  useEffect(() => {
    updateForm()
  }, [updateForm])

  const handlePost = async (value: CreatePushTemplateDto & UpdatePushTemplateDto) => {
    if (value.id) {
      await notificationApi.updatePushTemplate(value)
    } else {
      await notificationApi.createPushTemplate(value)
    }
    message.success(`${title}成功`)
    onSuccess()
    onClose()
  }

  return (
    <Drawer
      title={title}
      open={open}
      onClose={onClose}
      width={660}
      footer={
        <div className="flex-1 flex justify-end gap-2">
          <Button type="primary" onClick={form.submit} loading={isSubmitting}>
            提交
          </Button>
        </div>
      }
    >
      <Form onFinish={handleSubmit(handlePost)} form={form} labelCol={{ flex: '5rem' }}>
        <Form.Item
          label="模板名称"
          required
          validateStatus={errors.name ? 'error' : ''}
          help={errors.name && errors.name.message}
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => <Input allowClear placeholder="请输入模板名称" {...field} />}
          />
        </Form.Item>
        <Form.Item
          label="通知标题"
          required
          validateStatus={errors.title ? 'error' : ''}
          help={errors.title && errors.title.message}
        >
          <Controller
            name="title"
            control={control}
            render={({ field }) => <Input allowClear placeholder="请输入通知标题" {...field} />}
          />
        </Form.Item>
        <Form.Item label="链接" validateStatus={errors.link ? 'error' : ''} help={errors.link && errors.link.message}>
          <Controller
            name="link"
            control={control}
            render={({ field }) => <Input allowClear placeholder="请输入链接" {...field} />}
          />
        </Form.Item>
        <Form.Item
          label="推送内容"
          validateStatus={errors.body ? 'error' : ''}
          help={errors.body && errors.body.message}
        >
          <Controller
            name="body"
            control={control}
            render={({ field }) => <Input.TextArea placeholder="请输入推送内容" {...field} />}
          />
        </Form.Item>
        <Form.Item
          label="内容图片"
          validateStatus={errors.imageId ? 'error' : ''}
          help={errors.imageId && errors.imageId.message}
        >
          <Controller
            name="imageId"
            control={control}
            render={({ field }) => (
              <SelectImage
                value={image ? [image] : []}
                onChange={files => {
                  setImage(files[0])
                  field.onChange(files[0].id)
                }}
              />
            )}
          />
        </Form.Item>
        <FormList control={control} name="actions" label="按钮">
          {register => {
            const titleReg = register('title')
            const linkReg = register('link')
            return (
              <>
                <Form.Item validateStatus={titleReg.error ? 'error' : ''} help={titleReg.error}>
                  <Input
                    placeholder="标题"
                    value={titleReg.value}
                    onChange={val => {
                      titleReg.onChange(val.target.value)
                    }}
                  />
                </Form.Item>
                <Form.Item validateStatus={linkReg.error ? 'error' : ''} help={linkReg.error}>
                  <Input
                    placeholder="链接"
                    value={linkReg.value}
                    onChange={val => {
                      linkReg.onChange(val.target.value)
                    }}
                  />
                </Form.Item>
              </>
            )
          }}
        </FormList>
      </Form>
    </Drawer>
  )
}
