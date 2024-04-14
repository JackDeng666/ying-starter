import { useEffect, useState } from 'react'
import { Form, Modal, Input, message } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'

import { UpdateSysUserPasswordDto } from '@ying/shared'
import { sysUserApi } from '@/admin/api'

const updateResolver = classValidatorResolver(UpdateSysUserPasswordDto)

export type ChangePassModalProps = {
  formValue: UpdateSysUserPasswordDto
  title: string
  show: boolean
  onSuccess: VoidFunction
  onCancel: VoidFunction
}

export function ChangePassModal({ title, show, formValue, onSuccess, onCancel }: ChangePassModalProps) {
  const [form] = Form.useForm()

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<UpdateSysUserPasswordDto>({
    resolver: updateResolver,
    defaultValues: formValue
  })

  useEffect(() => {
    reset(formValue)
  }, [formValue, reset])

  const [loading, setLoading] = useState(false)

  const handlePost = async (value: UpdateSysUserPasswordDto) => {
    try {
      setLoading(true)
      await sysUserApi.updatePassword(value)
      message.success(`${title}成功`)
      onSuccess()
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title={title} open={show} onOk={form.submit} onCancel={onCancel} confirmLoading={loading}>
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
