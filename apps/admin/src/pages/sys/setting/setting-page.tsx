import { useCallback, useEffect } from 'react'
import { Button, Card, App, Space, Form, Input, Spin } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'

import { SettingDto } from '@ying/shared'
import { useFetch, useSubmit } from '@ying/fontend-shared/hooks'

import { sysSettingApi } from '@/admin/api'

export default function SettingPage() {
  const { message } = App.useApp()

  const [clearPermissionCacheLoading, permissionCacheSubmit] = useSubmit()
  const [clearDriftFileLoading, clearDriftFileSubmit] = useSubmit()

  const clearPermissionCache = async () => {
    await sysSettingApi.clearPermissionCache()
    message.success('清除系统权限缓存成功')
  }

  const clearDriftFile = async () => {
    await sysSettingApi.clearDriftFile()
    message.success('清除游离文件成功')
  }

  const { loading, data } = useFetch({
    func: useCallback(() => sysSettingApi.getSetting(), [])
  })

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<SettingDto>({
    resolver: classValidatorResolver(SettingDto)
  })

  useEffect(() => {
    reset(data)
  }, [data, reset])

  const handlePost = async (value: SettingDto) => {
    await sysSettingApi.updateSetting(value)
    message.success('更新成功')
  }

  return (
    <Card title="系统设置" bordered={false} styles={{ body: { padding: 0 } }}>
      <Spin spinning={loading} wrapperClassName="max-h-[800px] overflow-auto no-scrollbar p-5">
        <Space>
          <Button
            type="primary"
            loading={clearPermissionCacheLoading}
            onClick={permissionCacheSubmit(clearPermissionCache)}
          >
            清除系统权限缓存
          </Button>
          <Button type="primary" loading={clearDriftFileLoading} onClick={clearDriftFileSubmit(clearDriftFile)}>
            清除游离文件
          </Button>
        </Space>

        <Form className="!mt-4" onFinish={handleSubmit(handlePost)} labelCol={{ flex: '7em' }}>
          <Form.Item
            label="debug用户ID"
            validateStatus={errors.debugUserIds ? 'error' : ''}
            help={errors.debugUserIds && errors.debugUserIds.message}
          >
            <Controller
              name="debugUserIds"
              control={control}
              render={({ field }) => <Input.TextArea placeholder="请输入需要debug的用户ID，用英文,分隔" {...field} />}
            />
          </Form.Item>

          <div className="flex justify-end">
            <Button type="primary" htmlType="submit" loading={isSubmitting}>
              保存
            </Button>
          </div>
        </Form>
      </Spin>
    </Card>
  )
}
