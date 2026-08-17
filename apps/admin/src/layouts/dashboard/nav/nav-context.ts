import { createContext } from 'react'
import type { MenuProps } from 'antd'
import type { ItemType } from 'antd/es/menu/interface'

export type NavContextValue = {
  openKeys: string[]
  selectedKeys: string[]
  menuList: ItemType[]
  onOpenChange: NonNullable<MenuProps['onOpenChange']>
  onClick: NonNullable<MenuProps['onClick']>
}

export const NavContext = createContext<NavContextValue | undefined>(undefined)
