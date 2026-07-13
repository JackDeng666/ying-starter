import { Button, Card, App, Space } from 'antd'
import { useMutation } from '@tanstack/react-query'

import { sysSettingApi } from '@/api'

export default function SettingPage() {
  const { message } = App.useApp()

  const { isPending: clearPermissionCacheLoading, mutate: clearPermissionCache } = useMutation({
    mutationFn: () => sysSettingApi.clearPermissionCache(),
    onSuccess: () => {
      message.success('清除系统权限缓存成功')
    }
  })

  const { isPending: clearDriftFileLoading, mutate: clearDriftFile } = useMutation({
    mutationFn: () => sysSettingApi.clearDriftFile(),
    onSuccess: () => {
      message.success('清除游离文件成功')
    }
  })

  return (
    <Card title="系统设置" variant="borderless">
      <Space>
        <Button type="primary" loading={clearPermissionCacheLoading} onClick={() => clearPermissionCache()}>
          清除系统权限缓存
        </Button>
        <Button type="primary" loading={clearDriftFileLoading} onClick={() => clearDriftFile()}>
          清除游离文件
        </Button>
      </Space>
    </Card>
  )
}
