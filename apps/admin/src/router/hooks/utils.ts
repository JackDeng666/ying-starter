import type { AppRouteObject, RouteMeta } from '@/types/router'

export function transformRoutesByPermission(routes: AppRouteObject[], codes: string[]): AppRouteObject[] {
  return routes.map(item => {
    const newItem = {
      ...item
    }
    if (item.meta?.permission?.code && newItem.meta) {
      if (!codes.includes(item.meta.permission.code)) {
        newItem.meta.hideMenu = true
        newItem.meta.hideTab = true
      }
    }
    if (item.children?.length) {
      newItem.children = transformRoutesByPermission(item.children, codes)
    }
    return newItem
  })
}

export function flattenRoutesToRouteMetas(routes: AppRouteObject[]) {
  return routes.reduce<RouteMeta[]>((prev, item) => {
    const { meta, children } = item
    if (meta) prev.push(meta)
    if (children) prev.push(...flattenRoutesToRouteMetas(children))
    return prev
  }, [])
}

export function routerFilter(routes: AppRouteObject[]): AppRouteObject[] {
  return routes
    .filter(item => !item.meta?.disabled)
    .map(item => {
      if (item.children?.length) {
        return { ...item, children: routerFilter(item.children) }
      }
      return item
    })
}

export function navMenuFilter(routes: AppRouteObject[]): AppRouteObject[] {
  return routes
    .filter(item => !!item.meta?.key)
    .map(item => {
      if (item.children) {
        return { ...item, children: navMenuFilter(item.children) }
      }
      return item
    })
    .sort((a, b) => (b.sort ?? 0) - (a.sort ?? 0))
}
