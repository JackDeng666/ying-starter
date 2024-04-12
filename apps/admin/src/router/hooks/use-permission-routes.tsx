import { Suspense, lazy, useCallback, useMemo } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { createTreeFns } from '@ying/utils'

import { BasicStatus, PermissionType } from '@ying/shared'
import { SysPermissionEntity } from '@ying/shared/entities'

import { CircleLoading } from '@/components/loading'
import { useUserPermission } from '@/store/userStore'
import { AppRouteObject } from '@/types/router'
import IframePage from '@/pages/iframe'
import { flattenMenuRoutes, menuFilter } from '../utils'

// 使用 import.meta.glob 获取所有路由组件
const pages = import.meta.glob('/src/pages/**/*.tsx')

// 构建绝对路径的函数
function resolveComponent(path: string) {
  return pages[`/src/pages${path}`]
}

/**
 * return routes about permission
 */
export function usePermissionRoutes() {
  const permissions = useUserPermission()

  const permissionRoutes = useMemo(() => {
    const treePermissions = createTreeFns(permissions, 'code', 'parentCode').toTree(null)

    const permissionRoutes = transformPermissionToMenuRoutes(treePermissions, permissions)
    return [...permissionRoutes]
  }, [permissions])

  const flattenRoutes = useCallback(flattenMenuRoutes, [])

  const flattenedRoutes = useMemo(() => {
    const menuRoutes = menuFilter(permissionRoutes)
    return flattenRoutes(menuRoutes)
  }, [flattenRoutes, permissionRoutes])

  return { permissionRoutes, flattenedRoutes }
}

/**
 * transform SysPermissionEntity[] to AppRouteObject[]
 * @param permissions
 * @param parent
 */
function transformPermissionToMenuRoutes(
  permissions: SysPermissionEntity[],
  flattenedPermissions: SysPermissionEntity[]
) {
  return permissions.map(permission => {
    const {
      route,
      type,
      label,
      icon,
      sort,
      status,
      frameSrc,
      noCache,
      component,
      parentCode,
      children = []
    } = permission

    const appRoute: AppRouteObject = {
      path: route,
      sort,
      meta: {
        label,
        key: getCompleteRoute(permission, flattenedPermissions),
        disabled: status === BasicStatus.DISABLE,
        icon,
        frameSrc,
        component,
        noCache
      }
    }

    if (type === PermissionType.CATALOGUE) {
      appRoute.meta.hideTab = true
      if (!parentCode) {
        appRoute.element = (
          <Suspense fallback={<CircleLoading />}>
            <Outlet />
          </Suspense>
        )
      }
      appRoute.children = transformPermissionToMenuRoutes(children, flattenedPermissions)
      if (children.length) {
        appRoute.children.unshift({
          index: true,
          element: <Navigate to={children[0].route} replace />
        })
      }
    } else if (type === PermissionType.MENU) {
      const Element = lazy(resolveComponent(component!) as any)
      if (appRoute.meta.frameSrc) {
        appRoute.element = <IframePage src={frameSrc} />
      } else {
        appRoute.element = <Element />
      }
    }

    return appRoute
  })
}

/**
 * Splicing from the root permission route to the current permission route
 * @param {Permission} permission - current permission
 * @param {Permission[]} flattenedPermissions - flattened permission array
 * @param {string} route - parent permission route
 * @returns {string} - The complete route after splicing
 */
function getCompleteRoute(permission: SysPermissionEntity, flattenedPermissions: SysPermissionEntity[], route = '') {
  const currentRoute = route ? `/${permission.route}${route}` : `/${permission.route}`

  if (permission.parentCode) {
    const parentPermission = flattenedPermissions.find(p => p.code === permission.parentCode)!
    return getCompleteRoute(parentPermission, flattenedPermissions, currentRoute)
  }

  return currentRoute
}
