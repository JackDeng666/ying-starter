import { useMemo } from 'react'

import { deepCopyArray } from '@ying/utils'

import { useUserPermission } from '@/admin/store/userStore'
import { flattenMenuRoutes, menuFilter, routerRoutesFilter } from '@/admin/router/utils'
import { menuRoutes } from '@/admin/router/routes/menu-routes'
import { AppRouteObject } from '@/admin/types/router'

// @Deprecated
// 使用 import.meta.glob 获取所有路由组件
// const pages = import.meta.glob('/src/pages/**/*.tsx')
// 构建绝对路径的函数
// function resolveComponent(path: string) {
//   return pages[`/src/pages${path}`]
// }

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
    if (menu.meta?.permission) {
      if (!codes.includes(menu.meta.permission.meta.code)) {
        newMenu.meta.disabled = true
      }
    }
    if (menu.children?.length) {
      newMenu.children = transformMenuRoutes(menu.children, codes)
    }
    return newMenu
  })
}

/**
 * @Deprecated
 * transform SysPermissionEntity[] to AppRouteObject[]
 * @param permissions
 * @param parent
 */
// function transformPermissionToMenuRoutes(
//   permissions: SysPermissionEntity[],
//   flattenedPermissions: SysPermissionEntity[]
// ) {
//   return permissions.map(permission => {
//     const {
//       route,
//       type,
//       label,
//       icon,
//       sort,
//       status,
//       frameSrc,
//       noCache,
//       component,
//       parentCode,
//       children = [],
//       hideMenu
//     } = permission

//     const appRoute: AppRouteObject = {
//       path: route,
//       sort,
//       meta: {
//         label,
//         key: getCompleteRoute(permission, flattenedPermissions),
//         disabled: status === BasicStatus.DISABLE,
//         icon,
//         frameSrc,
//         component,
//         noCache,
//         hideMenu
//       }
//     }

//     if (type === PermissionType.CATALOGUE) {
//       if (appRoute.meta) appRoute.meta.hideTab = true
//       if (!parentCode) {
//         appRoute.element = (
//           <Suspense fallback={<CircleLoading />}>
//             <Outlet />
//           </Suspense>
//         )
//       }
//       appRoute.children = transformPermissionToMenuRoutes(children, flattenedPermissions)
//       if (children.length) {
//         appRoute.children.unshift({
//           index: true,
//           element: <Navigate to={children[0].route || ''} replace />
//         })
//       }
//     } else if (type === PermissionType.MENU) {
//       const Element = lazy(resolveComponent(component!) as any)
//       if (frameSrc) {
//         appRoute.element = <IframePage src={frameSrc} />
//       } else {
//         appRoute.element = <Element />
//       }
//     }

//     return appRoute
//   })
// }

/**
 *  @Deprecated
 * Splicing from the root permission route to the current permission route
 * @param {Permission} permission - current permission
 * @param {Permission[]} flattenedPermissions - flattened permission array
 * @param {string} route - parent permission route
 * @returns {string} - The complete route after splicing
 */
// function getCompleteRoute(permission: SysPermissionEntity, flattenedPermissions: SysPermissionEntity[], route = '') {
//   const currentRoute = route ? `/${permission.route}${route}` : `/${permission.route}`

//   if (permission.parentCode) {
//     const parentPermission = flattenedPermissions.find(p => p.code === permission.parentCode)!
//     return getCompleteRoute(parentPermission, flattenedPermissions, currentRoute)
//   }

//   return currentRoute
// }
