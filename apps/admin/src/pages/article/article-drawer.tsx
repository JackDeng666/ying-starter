import { useCallback, useEffect } from 'react'
import { Form, Input, App, InputNumber, Drawer, Button, Select } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'

import { CreateArticleDto, UpdateArticleDto } from '@ying/shared'
import { ArticleEntity } from '@ying/shared/entities'
import { useDialogOpen } from '@ying/fontend-shared/hooks'

import { TagsEdit } from '@/admin/components/tags'
import { SelectImage } from '@/admin/components/image-tool/select-image'
import { IntlInput, IntlEditor } from '@/admin/components/intl'
import { articleApi } from '@/admin/api'
import { BasicStatusOptions } from '@/admin/constant'
import { defaultValues } from './constant'

const createResolver = classValidatorResolver(CreateArticleDto)
const updateResolver = classValidatorResolver(UpdateArticleDto)

type ArticleDrawerProps = ReturnType<typeof useDialogOpen<ArticleEntity>> & {
  onSuccess?: VoidFunction
}

export function ArticleDrawer({ open, formValue, render, onSuccess, onClose }: ArticleDrawerProps) {
  const title = `${formValue ? '编辑' : '新增'}文章`
  const [form] = Form.useForm()
  const { message } = App.useApp()
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<CreateArticleDto & UpdateArticleDto>({
    resolver: formValue ? updateResolver : createResolver,
    defaultValues
  })

  const updateForm = useCallback(async () => {
    if (formValue) {
      reset(formValue)
    } else {
      reset(defaultValues)
    }
  }, [formValue, reset])

  useEffect(() => {
    updateForm()
  }, [updateForm])

  const handlePost = async (value: CreateArticleDto & UpdateArticleDto) => {
    if (value.id) {
      await articleApi.update(value)
    } else {
      await articleApi.create(value)
    }
    message.success(`${title}成功`)
    onSuccess && onSuccess()
    onClose()
  }

  if (!render) return null

  return (
    <Drawer
      title={title}
      open={open}
      onClose={onClose}
      width={688}
      placement="left"
      footer={
        <div className="flex-1 flex justify-end gap-2">
          <Button type="primary" onClick={form.submit} loading={isSubmitting}>
            确认
          </Button>
        </div>
      }
    >
      <Form form={form} labelCol={{ flex: '5rem' }} onFinish={handleSubmit(handlePost)}>
        <Form.Item
          label="名称"
          required
          validateStatus={errors.name ? 'error' : ''}
          help={errors.name && errors.name.message}
        >
          <Controller
            control={control}
            name="name"
            render={({ field }) => <Input allowClear placeholder="请输入名称" {...field} />}
          />
        </Form.Item>

        <Form.Item
          label="标题"
          required
          validateStatus={errors.title ? 'error' : ''}
          help={errors.title && errors.title.message}
        >
          <Controller
            control={control}
            name="title"
            render={({ field }) => <IntlInput allowClear placeholder="请输入标题" {...field} />}
          />
        </Form.Item>

        <Form.Item
          label="封面"
          required
          validateStatus={errors.coverId ? 'error' : ''}
          help={errors.coverId && errors.coverId.message}
        >
          <Controller
            control={control}
            name="coverId"
            render={({ field }) => (
              <SelectImage
                maxLength={1}
                defaultValue={formValue?.cover}
                onChange={files => field.onChange(files[0]?.id)}
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="状态"
          required
          validateStatus={errors.status ? 'error' : ''}
          help={errors.status && errors.status.message}
        >
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select
                style={{ width: 120 }}
                placeholder="选择状态"
                options={BasicStatusOptions}
                allowClear
                {...field}
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="关键字"
          validateStatus={errors.keywords ? 'error' : ''}
          help={errors.keywords && errors.keywords.message}
        >
          <Controller control={control} name="keywords" render={({ field }) => <TagsEdit {...field} />} />
        </Form.Item>

        <Form.Item label="排序" validateStatus={errors.sort ? 'error' : ''} help={errors.sort && errors.sort.message}>
          <Controller
            control={control}
            name="sort"
            render={({ field }) => <InputNumber style={{ width: '100%' }} placeholder="请输入排序" {...field} />}
          />
        </Form.Item>

        <Form.Item
          label="内容"
          validateStatus={errors.content ? 'error' : ''}
          help={errors.content && errors.content.message}
        >
          <Controller
            control={control}
            name="content"
            render={({ field }) => <IntlEditor className="h-80" value={field.value} onChange={field.onChange} />}
          />
        </Form.Item>
      </Form>
    </Drawer>
  )
}
