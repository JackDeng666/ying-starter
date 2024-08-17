import { useEffect } from 'react'
import { Form, Modal, Input, message } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'

import { UpdateSysUserPasswordDto } from '@ying/shared'
import { useDialogOpen } from '@ying/fontend-shared/hooks'

import { sysUserApi } from '@/admin/api'

type ChangePassModalProps = ReturnType<typeof useDialogOpen<UpdateSysUserPasswordDto>> & {
  onSuccess?: VoidFunction
}

export function ChangePassModal({ open, formValue, onSuccess, onClose }: ChangePassModalProps) {
  const title = '修改密码'
  const [form] = Form.useForm()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<UpdateSysUserPasswordDto>({
    resolver: classValidatorResolver(UpdateSysUserPasswordDto),
    defaultValues: formValue
  })

  useEffect(() => {
    if (formValue) {
      reset(formValue)
    }
  }, [formValue, reset])

  const handlePost = async (value: UpdateSysUserPasswordDto) => {
    await sysUserApi.updatePassword(value)
    onClose()
    message.success(`${title}成功`)
    onSuccess && onSuccess()
  }

  return (
    <Modal title={title} open={open} onOk={form.submit} onCancel={onClose} confirmLoading={isSubmitting}>
      <Form form={form} labelCol={{ span: 2 }} onFinish={handleSubmit(handlePost)}>
        <Form.Item<UpdateSysUserPasswordDto>
          name="password"
          required
          validateStatus={errors.password ? 'error' : ''}
          help={errors.password && errors.password.message}
        >
          <Controller
            name="password"
            control={control}
            render={({ field }) => <Input.Password allowClear placeholder="请输入新密码" {...field} />}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
