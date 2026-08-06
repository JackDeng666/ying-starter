import { PropsWithChildren, useEffect, useRef, useState } from 'react'
import { MenuProps } from 'antd'
import { ItemType } from 'antd/es/menu/interface'
import { useLocation, useMatches } from 'react-router-dom'

import { usePermissionRoutes, useRouter } from '@/router/hooks'
import { routeToMenu } from '@/router/route-to-menu'

import { NavContext } from './nav-context'

export const NavContextProvider = ({ children }: PropsWithChildren) => {
  const { push } = useRouter()
  const matches = useMatches()
  const { pathname } = useLocation()
  const { navMenuRoutes, flattenedRoutes } = usePermissionRoutes()

  const [openKeys, setOpenKeys] = useState<string[]>([])
  const [selectedKeys, setSelectedKeys] = useState<string[]>([''])
  const [menuList, setMenuList] = useState<ItemType[]>([])

  const initializedRef = useRef(false)
  useEffect(() => {
    if (!initializedRef.current) {
      const openKeys = matches.filter(match => match.pathname !== '/').map(match => match.pathname)
      setOpenKeys(openKeys)
      setSelectedKeys([pathname])
      initializedRef.current = true
    }
  }, [pathname, matches])

  useEffect(() => {
    setSelectedKeys([pathname])
  }, [pathname])

  useEffect(() => {
    const menus = routeToMenu(navMenuRoutes)
    setMenuList(menus)
  }, [navMenuRoutes])

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
    if (currentRoute?.frameSrc) {
      window.open(currentRoute.frameSrc, '_black')
      return
    }
    push(key)
  }

  return (
    <NavContext.Provider
      value={{
        openKeys,
        selectedKeys,
        menuList,
        onOpenChange,
        onClick
      }}
    >
      {children}
    </NavContext.Provider>
  )
}
