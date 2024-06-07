import { useCallback, useEffect, useState } from 'react'
import { Form, Drawer, Input, Button, Radio, Select, App } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'

import { debounce } from '@ying/utils'
import { BasicStatus, CreateSysUserDto, UpdateSysUserDto } from '@ying/shared'
import { useFetch } from '@ying/fontend-shared/hooks'

import { roleApi, sysUserApi } from '@/admin/api'

const createResolver = classValidatorResolver(CreateSysUserDto)
const updateResolver = classValidatorResolver(UpdateSysUserDto)

export type UserDrawerProps = {
  formValue: Partial<UpdateSysUserDto>
  title: string
  show: boolean
  onSuccess: VoidFunction
  onCancel: VoidFunction
}

export function UserDrawer({ title, show, formValue, onSuccess, onCancel }: UserDrawerProps) {
  const { message } = App.useApp()
  const [form] = Form.useForm()
  const { data: roles, run: loadRoles } = useFetch({
    func: useCallback(async name => {
      const data = await roleApi.list({ name })
      return data.map(el => ({ ...el, disabled: el.name === 'Super Admin' }))
    }, [])
  })

  const handleSearch = debounce(value => {
    loadRoles(value)
  }, 500)

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CreateSysUserDto & UpdateSysUserDto>({
    resolver: formValue.id ? updateResolver : createResolver,
    defaultValues: formValue
  })

  useEffect(() => {
    reset(formValue)
  }, [formValue, reset])

  const [loading, setLoading] = useState(false)

  const handlePost = async (value: CreateSysUserDto & UpdateSysUserDto) => {
    try {
      setLoading(true)
      if (value.id) {
        await sysUserApi.update(value)
      } else {
        await sysUserApi.create(value)
      }
      message.success(`${title}成功`)
      onSuccess()
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  return (
    <Drawer
      title={title}
      open={show}
      onClose={onCancel}
      width={660}
      footer={
        <div className="flex-1 flex justify-end gap-2">
          <Button type="primary" onClick={form.submit} loading={loading}>
            提交
          </Button>
        </div>
      }
    >
      <Form onFinish={handleSubmit(handlePost)} form={form} labelCol={{ span: 2 }}>
        <Form.Item<CreateSysUserDto>
          label="昵称"
          name="name"
          required
          validateStatus={errors.name ? 'error' : ''}
          help={errors.name && errors.name.message}
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => <Input allowClear placeholder="请输入昵称" {...field} />}
          />
        </Form.Item>

        <Form.Item<CreateSysUserDto>
          label="账号"
          name="account"
          required
          validateStatus={errors.account ? 'error' : ''}
          help={errors.account && errors.account.message}
        >
          <Controller
            name="account"
            control={control}
            render={({ field }) => <Input allowClear placeholder="请输入账号" {...field} />}
          />
        </Form.Item>

        {!formValue.id && (
          <Form.Item<CreateSysUserDto>
            label="密码"
            name="password"
            required
            validateStatus={errors.password ? 'error' : ''}
            help={errors.password && errors.password.message}
          >
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input.Password allowClear placeholder="请输入密码" {...field} autoComplete="new-password" />
              )}
            />
          </Form.Item>
        )}

        <Form.Item<CreateSysUserDto>
          label="邮箱"
          name="email"
          validateStatus={errors.email ? 'error' : ''}
          help={errors.email && errors.email.message}
        >
          <Controller
            name="email"
            control={control}
            render={({ field }) => <Input allowClear placeholder="请输入邮箱" {...field} autoComplete="new-password" />}
          />
        </Form.Item>

        <Form.Item<CreateSysUserDto>
          label="状态"
          name="status"
          required
          validateStatus={errors.status ? 'error' : ''}
          help={errors.status && errors.status.message}
        >
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Radio.Group optionType="button" buttonStyle="solid" {...field}>
                <Radio value={BasicStatus.ENABLE}>可用</Radio>
                <Radio value={BasicStatus.DISABLE}>禁用</Radio>
              </Radio.Group>
            )}
          />
        </Form.Item>

        <Form.Item<CreateSysUserDto>
          label="角色"
          name="roleIds"
          validateStatus={errors.roleIds ? 'error' : ''}
          help={errors.roleIds && errors.roleIds.message}
        >
          <Controller
            name="roleIds"
            control={control}
            render={({ field }) => (
              <Select
                fieldNames={{
                  value: 'id',
                  label: 'name'
                }}
                filterOption={false}
                mode="multiple"
                placeholder="请选择角色"
                options={roles}
                onSearch={value => {
                  handleSearch(value)
                }}
                allowClear
                {...field}
              />
            )}
          />
        </Form.Item>

        <Form.Item<CreateSysUserDto>
          label="备注"
          name="remark"
          validateStatus={errors.remark ? 'error' : ''}
          help={errors.remark && errors.remark.message}
        >
          <Controller
            name="remark"
            control={control}
            render={({ field }) => <Input.TextArea style={{ width: '100%' }} placeholder="请输入备注" {...field} />}
          />
        </Form.Item>
      </Form>
    </Drawer>
  )
}
