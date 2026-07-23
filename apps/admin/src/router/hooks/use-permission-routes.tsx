import { useMemo } from 'react'

import { deepCopyArray } from '@ying/utils'

import { useUserPermission } from '@/store/userStore'
import { flattenMenuRoutes, menuFilter, routerRoutesFilter } from '@/router/utils'
import { menuRoutes } from '@/router/routes/menu-routes'
import { AppRouteObject } from '@/types/router'

/**
 * return routes about permission
 */
export function usePermissionRoutes() {
  const permissions = useUserPermission()

  const permissionRoutes = useMemo(() => {
    return transformMenuRoutes(deepCopyArray(menuRoutes), permissions?.map(el => el.code) || [])
  }, [permissions])

  const flattenedRoutes = useMemo(() => {
    return flattenMenuRoutes(permissionRoutes)
  }, [permissionRoutes])

  const navMenuRoutes = useMemo(() => {
    return menuFilter(deepCopyArray(permissionRoutes))
  }, [permissionRoutes])

  const routerRoutes = useMemo(() => {
    return routerRoutesFilter(deepCopyArray(permissionRoutes))
  }, [permissionRoutes])

  return { permissionRoutes, routerRoutes, navMenuRoutes, flattenedRoutes }
}

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
