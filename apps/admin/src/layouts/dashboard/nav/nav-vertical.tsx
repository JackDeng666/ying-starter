import { useToggle } from 'react-use'
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons'
import { Menu } from 'antd'
import Color from 'color'
import { cn } from '@ying/frontend/ui'
import Logo from '@/components/logo'
import Scrollbar from '@/components/scrollbar'
import { useResponsive, useThemeToken } from '@/theme/hooks'
import { useSettings } from '@/store'
import { ThemeNavLayout } from '@/types/enum'
import { NAV_COLLAPSED_WIDTH, NAV_WIDTH } from '../constant'
import { useNavContext } from './use-nav-context'

type NavProps = {
  show?: boolean
  onMenuClick?: () => void
}
export function NavVertical({ show, onMenuClick }: NavProps) {
  const { colorTextBase, colorBgElevated, colorBorder } = useThemeToken()
  const { themeLayout } = useSettings()
  const isVertical = themeLayout === ThemeNavLayout.Vertical
  const [collapsed, toggleCollapsed] = useToggle(false)
  const { screenMap } = useResponsive()
  const { openKeys, selectedKeys, menuList, onOpenChange, onClick } = useNavContext()

  return (
    <div
      className="flex flex-col z-50 shrink-0 h-full"
      style={{
        background: colorBgElevated,
        width: (screenMap.md || show) && isVertical ? (collapsed ? NAV_COLLAPSED_WIDTH : NAV_WIDTH) : 0,
        borderRight: `1px dashed ${Color(colorBorder).alpha(0.6).toString()}`,
        transition: 'width 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'
      }}
    >
      <div
        className={cn(
          'relative hidden md:flex items-center justify-center h-20',
          show && 'flex',
          !isVertical && 'hidden!'
        )}
      >
        <Logo className="text-3xl" showName={!collapsed} />
        <button
          onClick={toggleCollapsed}
          className="absolute right-0 top-7 z-50 h-6 w-6 translate-x-1/2 cursor-pointer select-none rounded-full text-center text-gray! hidden md:block"
          style={{
            color: colorTextBase,
            borderColor: colorTextBase,
            fontSize: 16
          }}
        >
          {collapsed ? <MenuUnfoldOutlined size={20} /> : <MenuFoldOutlined size={20} />}
        </button>
      </div>
      <Scrollbar
        style={{
          height: 'calc(100vh - 70px)'
        }}
      >
        <Menu
          className="h-full border-none!"
          style={{
            background: colorBgElevated
          }}
          mode="inline"
          inlineCollapsed={collapsed}
          items={menuList}
          defaultOpenKeys={openKeys}
          openKeys={openKeys}
          defaultSelectedKeys={selectedKeys}
          selectedKeys={selectedKeys}
          onOpenChange={onOpenChange}
          onClick={menuInfo => {
            onClick(menuInfo)
            onMenuClick?.()
          }}
        />
      </Scrollbar>
    </div>
  )
}
