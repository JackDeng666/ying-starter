import { createContext } from 'react'
import { MenuProps } from 'antd'
import { ItemType } from 'antd/es/menu/interface'

export type NavContextValue = {
  openKeys: string[]
  selectedKeys: string[]
  menuList: ItemType[]
  onOpenChange: MenuProps['onOpenChange']
  onClick: MenuProps['onClick']
}

export const NavContext = createContext<NavContextValue | undefined>(undefined)
