import { Menu, MenuProps } from 'antd'
import { ItemType } from 'antd/es/menu/interface'
import { useState, useEffect, CSSProperties } from 'react'
import { useMatches, useLocation } from 'react-router-dom'

import { useRouteToMenuFn, usePermissionRoutes, useRouter } from '@/admin/router/hooks'
import { useThemeToken } from '@/admin/theme/hooks'
import { IframeLink } from '@/admin/constant'

import { NAV_HORIZONTAL_HEIGHT } from './config'

export default function NavHorizontal() {
  const { push } = useRouter()
  const matches = useMatches()
  const { pathname } = useLocation()

  const { colorBgElevated } = useThemeToken()

  const routeToMenuFn = useRouteToMenuFn()
  const { navMenuRoutes, flattenedRoutes } = usePermissionRoutes()

  /**
   * state
   */
  const [openKeys, setOpenKeys] = useState<string[]>([])
  const [selectedKeys, setSelectedKeys] = useState<string[]>([''])
  const [menuList, setMenuList] = useState<ItemType[]>([])

  useEffect(() => {
    setSelectedKeys([pathname])
  }, [pathname, matches])

  useEffect(() => {
    const menus = routeToMenuFn(navMenuRoutes)
    setMenuList(menus)
  }, [navMenuRoutes, routeToMenuFn])

  /**
   * events
   */
  const onOpenChange: MenuProps['onOpenChange'] = keys => {
    const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1)
    if (latestOpenKey) {
      setOpenKeys(keys)
    } else {
      setOpenKeys([])
    }
  }
  const onClick: MenuProps['onClick'] = ({ key }) => {
    const currentRoute = flattenedRoutes.find(el => el.key === key)
    if (currentRoute.frameSrc && currentRoute.component !== IframeLink) {
      window.open(currentRoute.frameSrc, '_black')
      return
    }
    push(key)
  }

  const menuStyle: CSSProperties = {
    background: colorBgElevated
  }
  return (
    <div className="w-screen" style={{ height: NAV_HORIZONTAL_HEIGHT }}>
      <Menu
        mode="horizontal"
        items={menuList}
        className="!z-10 !border-none"
        defaultOpenKeys={openKeys}
        defaultSelectedKeys={selectedKeys}
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        onClick={onClick}
        style={menuStyle}
      />
    </div>
  )
}
