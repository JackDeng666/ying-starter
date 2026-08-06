import { ItemType, MenuItemType } from 'antd/es/menu/interface'
import { Iconify, SvgIcon } from '@/components/icon'
import { AppRouteObject } from '@/types/router'

export const routeToMenu = (items: AppRouteObject[]) => {
  return items
    .filter(item => !item.meta?.hideMenu)
    .map(item => {
      const menuItem: ItemType<MenuItemType> = {
        key: undefined,
        children: undefined
      }
      const { meta, children } = item
      if (meta) {
        const { key, label, icon, disabled } = meta
        menuItem.key = key
        menuItem.disabled = disabled
        menuItem.label = label
        if (icon) {
          if (typeof icon === 'string') {
            if (icon.startsWith('ic')) {
              menuItem.icon = <SvgIcon prefix={null} icon={icon} />
            } else {
              menuItem.icon = <Iconify icon={icon} />
            }
          } else {
            menuItem.icon = icon
          }
        }
      }
      if (children) {
        menuItem.children = routeToMenu(children)
      }
      return menuItem
    })
}
