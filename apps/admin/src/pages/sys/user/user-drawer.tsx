import { useCallback, useEffect } from 'react'
import { Form, Drawer, Input, Button, Radio, Select, App } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'

import { BasicStatus, CreateSysUserDto, UpdateSysUserDto } from '@ying/shared'
import { useDialogOpen, useFetch } from '@ying/fontend-shared/hooks'

import { sysRoleApi, sysUserApi } from '@/admin/api'
import { defultUserValues } from './constant'

const createResolver = classValidatorResolver(CreateSysUserDto)
const updateResolver = classValidatorResolver(UpdateSysUserDto)

export type UserDrawerProps = ReturnType<typeof useDialogOpen<UpdateSysUserDto>> & {
  onSuccess?: VoidFunction
}

export function UserDrawer({ open, formValue, onSuccess, onClose }: UserDrawerProps) {
  const title = formValue ? '编辑系统用户' : '新增系统用户'
  const { message } = App.useApp()
  const [form] = Form.useForm()

  const { data: roles, debounceRun: loadRoles } = useFetch({
    func: useCallback(async name => {
      const data = await sysRoleApi.list({ name })
      return data.map(el => ({ ...el, disabled: el.name === 'Super Admin' }))
    }, [])
  })

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<CreateSysUserDto & UpdateSysUserDto>({
    resolver: formValue ? updateResolver : createResolver,
    defaultValues: defultUserValues
  })

  useEffect(() => {
    if (formValue) {
      reset(formValue)
    } else {
      reset(defultUserValues)
    }
  }, [formValue, reset])

  const handlePost = async (value: CreateSysUserDto & UpdateSysUserDto) => {
    if (value.id) {
      await sysUserApi.update(value)
    } else {
      await sysUserApi.create(value)
    }
    onClose()
    message.success(`${title}成功`)
    onSuccess && onSuccess()
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
      <Form onFinish={handleSubmit(handlePost)} form={form} labelCol={{ span: 2 }}>
        <Form.Item
          label="昵称"
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

        <Form.Item
          label="账号"
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

        {!formValue && (
          <Form.Item
            label="密码"
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

        <Form.Item
          label="邮箱"
          validateStatus={errors.email ? 'error' : ''}
          help={errors.email && errors.email.message}
        >
          <Controller
            name="email"
            control={control}
            render={({ field }) => <Input allowClear placeholder="请输入邮箱" {...field} autoComplete="new-password" />}
          />
        </Form.Item>

        <Form.Item
          label="状态"
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

        <Form.Item
          label="角色"
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
                onSearch={loadRoles}
                allowClear
                {...field}
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="备注"
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
