import { Drawer } from 'antd'
import { useThemeToken } from '@/hooks'
import { Main } from '../main'
import { useKeepaliveContext } from './use-keepalive-context'

export function FullscreenDrawer() {
  const { colorBgLayout } = useThemeToken()
  const { currentFullscreenTab, exitFullscreenTab } = useKeepaliveContext()
  const open = !!currentFullscreenTab

  return (
    <Drawer
      title={null}
      closeIcon={null}
      styles={{
        body: {
          background: colorBgLayout,
          padding: 0
        }
      }}
      open={open}
      keyboard
      onClose={exitFullscreenTab}
      size="100%"
      placement="top"
    >
      <Main>{currentFullscreenTab?.outlet}</Main>
    </Drawer>
  )
}
