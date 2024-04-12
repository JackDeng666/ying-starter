import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Form,
  Drawer,
  Input,
  InputNumber,
  Button,
  App,
  Radio,
  TreeSelect,
  Typography,
  Switch,
  Space,
  Select
} from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { useApi, useUpdate } from '@ying/hooks'
import { BasicStatus, PermissionType, CreateOrUpdatePermissionDto } from '@ying/shared'
import { permissionApi } from '@/api'
import { SysPermissionEntity } from '@ying/shared/entities'
import { ExternalLink, IframeLink } from '@/constant'

export type PermissionDrawerProps = {
  formValue: Partial<CreateOrUpdatePermissionDto>
  title: string
  show: boolean
  onSuccess: VoidFunction
  onCancel: VoidFunction
}

export function PermissionDrawer({ title, show, formValue, onSuccess, onCancel }: PermissionDrawerProps) {
  const forceUpdate = useUpdate()
  const [form] = Form.useForm()
  const { message } = App.useApp()

  const { data } = useApi({
    func: useCallback(() => permissionApi.list(), [])
  })

  const permissions = useMemo(() => {
    function sort(list: SysPermissionEntity[]) {
      if (!list) return undefined
      return list
        .map(el => ({
          ...el,
          children: sort(el.children),
          disabled: el.code === formValue.code || el.type === PermissionType.BUTTON
        }))
        .sort((a, b) => b.sort - a.sort)
    }

    return sort(data)
  }, [data, formValue])

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue
  } = useForm<CreateOrUpdatePermissionDto>({
    resolver: classValidatorResolver(CreateOrUpdatePermissionDto),
    defaultValues: formValue
  })

  const [loading, setLoading] = useState(false)

  const [showFrameSrc, setShowFrameSrc] = useState(false)

  useEffect(() => {
    reset(formValue)
    setShowFrameSrc(formValue.frameSrc ? true : false)
  }, [formValue, reset])

  const handlePost = async (value: CreateOrUpdatePermissionDto) => {
    try {
      setLoading(true)
      await permissionApi.createOrUpdate(value)
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
          <Button type="primary" loading={loading} onClick={form.submit}>
            提交
          </Button>
        </div>
      }
    >
      <Form onFinish={handleSubmit(handlePost)} labelCol={{ flex: '6em' }} form={form}>
        <Form.Item<CreateOrUpdatePermissionDto>
          label="类型"
          name="type"
          required
          validateStatus={errors.type ? 'error' : ''}
          help={errors.type && errors.type.message}
        >
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Radio.Group
                optionType="button"
                buttonStyle="solid"
                {...field}
                onChange={value => {
                  forceUpdate()
                  field.onChange(value)
                }}
              >
                <Radio value={PermissionType.CATALOGUE}>目录</Radio>
                <Radio value={PermissionType.MENU}>菜单</Radio>
                <Radio value={PermissionType.BUTTON}>按钮</Radio>
              </Radio.Group>
            )}
          />
        </Form.Item>

        <Form.Item<CreateOrUpdatePermissionDto>
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

        <Form.Item<CreateOrUpdatePermissionDto>
          label="名称"
          name="label"
          required
          validateStatus={errors.label ? 'error' : ''}
          help={errors.label && errors.label.message}
        >
          <Controller
            name="label"
            control={control}
            render={({ field }) => <Input allowClear placeholder="请输入名称" {...field} />}
          />
        </Form.Item>

        <Form.Item<CreateOrUpdatePermissionDto>
          label="权限标识"
          name="code"
          required
          validateStatus={errors.code ? 'error' : ''}
          help={errors.code && errors.code.message}
        >
          <Controller
            name="code"
            control={control}
            render={({ field }) => <Input allowClear placeholder="请输入权限标识" {...field} />}
          />
        </Form.Item>

        <Form.Item<CreateOrUpdatePermissionDto>
          label="父节点"
          name="parentCode"
          validateStatus={errors.parentCode ? 'error' : ''}
          help={errors.parentCode && errors.parentCode.message}
        >
          <Controller
            name="parentCode"
            control={control}
            render={({ field }) => (
              <TreeSelect
                fieldNames={{
                  value: 'code'
                }}
                placeholder="请选择父节点"
                treeData={permissions}
                {...field}
              />
            )}
          />
        </Form.Item>

        {getValues().type !== PermissionType.BUTTON && (
          <Form.Item<CreateOrUpdatePermissionDto>
            label="路由"
            name="route"
            required
            validateStatus={errors.route ? 'error' : ''}
            help={errors.route && errors.route.message}
          >
            <Controller
              name="route"
              control={control}
              render={({ field }) => <Input allowClear placeholder="请输入路由" {...field} />}
            />
          </Form.Item>
        )}

        {getValues().type === PermissionType.MENU && (
          <>
            <Form.Item<CreateOrUpdatePermissionDto>
              label="组件"
              name="component"
              required
              validateStatus={errors.component ? 'error' : ''}
              help={errors.component && errors.component.message}
            >
              <Controller
                name="component"
                control={control}
                render={({ field }) => (
                  <Input allowClear placeholder="请输入组件路径" disabled={showFrameSrc} {...field} />
                )}
              />
            </Form.Item>
            <Form.Item<CreateOrUpdatePermissionDto>
              label="链接"
              name="frameSrc"
              validateStatus={errors.frameSrc ? 'error' : ''}
              help={errors.frameSrc && errors.frameSrc.message}
            >
              <Controller
                name="frameSrc"
                control={control}
                render={({ field }) => (
                  <>
                    <Space direction="vertical" className="w-full">
                      <Space className="h-8 leading-8">
                        <Switch
                          checkedChildren="开启"
                          unCheckedChildren="关闭"
                          value={showFrameSrc}
                          onChange={isShow => {
                            if (isShow) {
                              setValue('component', IframeLink)
                            } else {
                              setValue('component', '')
                            }
                            setShowFrameSrc(isShow)
                          }}
                        />
                      </Space>

                      {showFrameSrc && (
                        <Input
                          addonBefore={
                            <Select
                              defaultValue={IframeLink}
                              onChange={value => {
                                setValue('component', value)
                              }}
                            >
                              <Select.Option value={IframeLink}>内嵌</Select.Option>
                              <Select.Option value={ExternalLink}>跳转</Select.Option>
                            </Select>
                          }
                          allowClear
                          placeholder="请输入链接"
                          {...field}
                        />
                      )}
                    </Space>
                  </>
                )}
              />
            </Form.Item>
            <Form.Item<CreateOrUpdatePermissionDto>
              label="不缓存"
              name="noCache"
              tooltip="配置在MultiTab模式下是否不缓存(默认全部缓存)"
              validateStatus={errors.noCache ? 'error' : ''}
              help={errors.noCache && errors.noCache.message}
            >
              <Controller
                name="noCache"
                control={control}
                render={({ field }) => <Switch checkedChildren="是" unCheckedChildren="否" {...field} />}
              />
            </Form.Item>
          </>
        )}

        {getValues().type !== PermissionType.BUTTON && (
          <Form.Item<CreateOrUpdatePermissionDto>
            label="图标"
            name="icon"
            tooltip={
              <Typography.Link href="https://icon-sets.iconify.design/" target="_blank">
                https://icon-sets.iconify.design/
              </Typography.Link>
            }
            validateStatus={errors.icon ? 'error' : ''}
            help={errors.icon && errors.icon.message}
          >
            <Controller
              name="icon"
              control={control}
              render={({ field }) => <Input allowClear placeholder="请输入图标" {...field} />}
            />
          </Form.Item>
        )}

        <Form.Item<CreateOrUpdatePermissionDto>
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
      </Form>
    </Drawer>
  )
}
