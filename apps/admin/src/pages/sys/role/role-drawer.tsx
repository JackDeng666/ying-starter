import { useCallback, useEffect, useMemo, useState } from 'react'
import { Form, Drawer, Input, InputNumber, Button, App, Radio, TreeSelect } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { BasicStatus, CreateRoleDto, UpdateRoleDto } from '@shared'
import { permissionApi, roleApi } from '@/api'
import { useApi } from '@/hooks/use-api'
import { SysPermissionEntity } from '@shared/entities'

const createResolver = classValidatorResolver(CreateRoleDto)
const updateResolver = classValidatorResolver(UpdateRoleDto)

export type RoleDrawerProps = {
  formValue: Partial<UpdateRoleDto>
  title: string
  show: boolean
  onSuccess: VoidFunction
  onCancel: VoidFunction
}

export function RoleDrawer({ title, show, formValue, onSuccess, onCancel }: RoleDrawerProps) {
  const [form] = Form.useForm()

  const { data } = useApi({
    func: useCallback(() => permissionApi.list(), [])
  })

  const permissionList = useMemo(() => {
    function sort(list: SysPermissionEntity[]) {
      if (!list) return undefined
      return list.map(el => ({ ...el, children: sort(el.children) })).sort((a, b) => b.sort - a.sort)
    }

    return sort(data)
  }, [data])

  const { message } = App.useApp()
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CreateRoleDto & UpdateRoleDto>({
    resolver: formValue.id ? updateResolver : createResolver,
    defaultValues: formValue
  })

  useEffect(() => {
    reset(formValue)
  }, [formValue, reset])

  const [loading, setLoading] = useState(false)

  const handlePost = async (value: CreateRoleDto & UpdateRoleDto) => {
    try {
      setLoading(true)
      if (value.id) {
        await roleApi.update(value)
      } else {
        await roleApi.create(value)
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
      <Form onFinish={handleSubmit(handlePost)} form={form} labelCol={{ span: 3 }}>
        <Form.Item<CreateRoleDto>
          label="名称"
          name="name"
          required
          validateStatus={errors.name ? 'error' : ''}
          help={errors.name && errors.name.message}
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => <Input allowClear placeholder="请输入名称" {...field} />}
          />
        </Form.Item>

        <Form.Item<CreateRoleDto>
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

        <Form.Item<CreateRoleDto>
          label="权限"
          name="permissionCodes"
          validateStatus={errors.permissionCodes ? 'error' : ''}
          help={errors.permissionCodes && errors.permissionCodes.message}
        >
          <Controller
            name="permissionCodes"
            control={control}
            render={({ field }) => (
              <TreeSelect
                fieldNames={{
                  value: 'code'
                }}
                treeNodeFilterProp="name"
                placeholder="请选择权限"
                treeCheckable
                treeCheckStrictly={true}
                showCheckedStrategy={TreeSelect.SHOW_ALL}
                treeData={permissionList}
                {...field}
                onChange={(value: any[]) => {
                  field.onChange(value.map(el => el.value))
                }}
              />
            )}
          />
        </Form.Item>

        <Form.Item<CreateRoleDto>
          label="排序"
          name="sort"
          validateStatus={errors.sort ? 'error' : ''}
          help={errors.sort && errors.sort.message}
        >
          <Controller
            name="sort"
            control={control}
            render={({ field }) => <InputNumber style={{ width: '100%' }} placeholder="请输入排序" {...field} />}
          />
        </Form.Item>

        <Form.Item<CreateRoleDto>
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
