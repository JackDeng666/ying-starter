import { useState } from 'react'
import { Menu, MenuProps } from 'antd'
import { useThemeToken } from '@/theme/hooks'
import { useSettings } from '@/store'
import { ThemeNavLayout } from '@/types/enum'
import { NAV_HORIZONTAL_HEIGHT } from '../constant'
import { useNavContext } from './use-nav-context'

export function NavHorizontal() {
  const { colorBgElevated } = useThemeToken()
  const { themeLayout } = useSettings()
  const isHorizontal = themeLayout === ThemeNavLayout.Horizontal
  const [openKeys, setOpenKeys] = useState<string[]>([])
  const onOpenChange: MenuProps['onOpenChange'] = keys => {
    const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1)
    if (latestOpenKey) {
      setOpenKeys(keys)
    } else {
      setOpenKeys([])
    }
  }
  const { selectedKeys, menuList, onClick } = useNavContext()

  return (
    <div
      className="w-full overflow-hidden"
      style={{
        height: isHorizontal ? NAV_HORIZONTAL_HEIGHT : 0,
        transition: 'height 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'
      }}
    >
      <Menu
        className="border-none!"
        style={{
          background: colorBgElevated
        }}
        mode="horizontal"
        items={menuList}
        defaultOpenKeys={openKeys}
        openKeys={openKeys}
        defaultSelectedKeys={selectedKeys}
        selectedKeys={selectedKeys}
        onOpenChange={onOpenChange}
        onClick={onClick}
      />
    </div>
  )
}
