import { useEffect, useState } from 'react'
import { Form, Modal, Input, message, Segmented, Button } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'

import { UpdateSysUserSelfUserInfoDto, UpdateSysUserSelfPasswordDto } from '@ying/shared'
import { commonApi, sysUserApi } from '@/admin/api'
import { UploadImage } from '@/admin/components/image-tool/upload-image'
import { getUserInfo, logout, useUserInfo } from '@/admin/store'

export type UserInfoModalProps = {
  title: string
  show: boolean
  onCancel: VoidFunction
}

type TSegmented = '个人信息' | '密码'

export function UserInfoModal({ title, show, onCancel }: UserInfoModalProps) {
  const [segmented, setSegmented] = useState<TSegmented>('个人信息')

  return (
    <Modal title={title} open={show} onCancel={onCancel} footer={null}>
      <div className="w-full flex flex-col items-center">
        <div className="mb-6">
          <Segmented<TSegmented>
            options={['个人信息', '密码']}
            onChange={value => {
              setSegmented(value)
            }}
          />
        </div>
        {segmented === '个人信息' && <ChangeUserInfoForm onCancel={onCancel} />}
        {segmented === '密码' && <ChangePasswordForm />}
      </div>
    </Modal>
  )
}

type ChangeUserInfoFormProps = {
  onCancel: VoidFunction
}

const ChangeUserInfoForm = ({ onCancel }: ChangeUserInfoFormProps) => {
  const userInfo = useUserInfo()
  const [form] = Form.useForm()
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<UpdateSysUserSelfUserInfoDto>({
    resolver: classValidatorResolver(UpdateSysUserSelfUserInfoDto)
  })
  useEffect(() => {
    if (userInfo) {
      reset({
        name: userInfo.name,
        avatarId: userInfo.avatarId
      })
    }
  }, [userInfo, reset])

  const [loading, setLoading] = useState(false)
  const handlePost = async (value: UpdateSysUserSelfUserInfoDto) => {
    try {
      setLoading(true)
      await sysUserApi.updateSelfInfo(value)
      message.success('修改用户信息成功')
      getUserInfo()
      onCancel()
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form className="w-full" form={form} labelCol={{ flex: '4em' }} onFinish={handleSubmit(handlePost)}>
      <Form.Item<UpdateSysUserSelfUserInfoDto>
        label="昵称"
        name="name"
        required
        validateStatus={errors.name ? 'error' : ''}
        help={errors.name && errors.name.message}
      >
        <Controller
          name="name"
          control={control}
          render={({ field }) => <Input allowClear placeholder="请输入新昵称" {...field} />}
        />
      </Form.Item>
      <Form.Item<UpdateSysUserSelfUserInfoDto>
        label="头像"
        name="avatarId"
        required
        validateStatus={errors.avatarId ? 'error' : ''}
        help={errors.avatarId && errors.avatarId.message}
      >
        <Controller
          name="avatarId"
          control={control}
          render={({ field }) => (
            <UploadImage
              className="rounded-full"
              withCrop
              aspectRatio={1}
              defaultUrl={userInfo?.avatar?.url}
              handleUpload={file => commonApi.uploadFile(file)}
              onSuccess={file => {
                field.onChange(file.id)
              }}
            />
          )}
        />
      </Form.Item>
      <Form.Item>
        <div className="flex justify-end">
          <Button type="primary" htmlType="submit" loading={loading}>
            确认修改
          </Button>
        </div>
      </Form.Item>
    </Form>
  )
}

const ChangePasswordForm = () => {
  const [form] = Form.useForm()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<UpdateSysUserSelfPasswordDto>({
    resolver: classValidatorResolver(UpdateSysUserSelfPasswordDto),
    defaultValues: {
      oldPass: '',
      newPass: ''
    }
  })

  const [loading, setLoading] = useState(false)

  const handlePost = async (value: UpdateSysUserSelfPasswordDto) => {
    try {
      setLoading(true)
      await sysUserApi.updateSelfPassword(value)
      message.success(`修改密码成功`)
      logout()
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form className="w-full" form={form} labelCol={{ flex: '5em' }} onFinish={handleSubmit(handlePost)}>
      <Form.Item<UpdateSysUserSelfPasswordDto>
        label="旧密码"
        name="oldPass"
        required
        validateStatus={errors.oldPass ? 'error' : ''}
        help={errors.oldPass && errors.oldPass.message}
      >
        <Controller
          name="oldPass"
          control={control}
          render={({ field }) => (
            <Input.Password allowClear placeholder="请输入旧密码" autoComplete="old-password" {...field} />
          )}
        />
      </Form.Item>
      <Form.Item<UpdateSysUserSelfPasswordDto>
        label="新密码"
        name="newPass"
        required
        validateStatus={errors.newPass ? 'error' : ''}
        help={errors.newPass && errors.newPass.message}
      >
        <Controller
          name="newPass"
          control={control}
          render={({ field }) => (
            <Input.Password allowClear placeholder="请输入新密码" autoComplete="new-password" {...field} />
          )}
        />
      </Form.Item>
      <Form.Item>
        <div className="flex justify-end">
          <Button type="primary" htmlType="submit" loading={loading}>
            确认修改
          </Button>
        </div>
      </Form.Item>
    </Form>
  )
}
