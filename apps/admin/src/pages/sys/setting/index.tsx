import { Button, Card, App, Space } from 'antd'
import { useSubmit } from '@ying/hooks'
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

  return (
    <Card title="系统设置" bordered={false} styles={{ body: { padding: 0 } }}>
      <div className="h-[630px] overflow-auto no-scrollbar p-5">
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
      </div>
    </Card>
  )
}
