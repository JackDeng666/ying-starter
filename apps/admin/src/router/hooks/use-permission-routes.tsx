import { deepCopyArray } from '@ying/utils'

import { useUserPermission } from '@/store/userStore'
import { flattenMenuRoutes, menuFilter, routerRoutesFilter } from '@/router/utils'
import { menuRoutes } from '@/router/routes/menu-routes'
import { AppRouteObject } from '@/types/router'

function transformMenuRoutes(menuRoutes: AppRouteObject[], codes: string[]) {
  return menuRoutes.map(menu => {
    const newMenu = {
      ...menu
    }
    if (menu.meta?.permission?.code && newMenu.meta) {
      if (!codes.includes(menu.meta.permission.code)) {
        newMenu.meta.hideMenu = true
        newMenu.meta.hideTab = true
      }
    }
    if (menu.children?.length) {
      newMenu.children = transformMenuRoutes(menu.children, codes)
    }
    return newMenu
  })
}

export function usePermissionRoutes() {
  const permissions = useUserPermission()

  const permissionRoutes = transformMenuRoutes(deepCopyArray(menuRoutes), permissions?.map(el => el.code) || [])

  const flattenedRoutes = flattenMenuRoutes(permissionRoutes)

  const navMenuRoutes = menuFilter(deepCopyArray(permissionRoutes))

  const routerRoutes = routerRoutesFilter(deepCopyArray(permissionRoutes))

  return { permissionRoutes, routerRoutes, navMenuRoutes, flattenedRoutes }
}
