import { AppRouteObject, RouteMeta } from '@/types/router'

/**
 * return menu routes
 */
export const menuFilter = (items: AppRouteObject[]) => {
  return items
    .filter(item => {
      const show = !!item.meta?.key
      if (show && item.children) {
        item.children = menuFilter(item.children)
      }
      return show
    })
    .sort((a, b) => b.sort - a.sort)
}

export const routerRoutesFilter = (items: AppRouteObject[]) => {
  return items.filter(item => {
    const show = !item.meta?.disabled
    if (show && item.children?.length) {
      item.children = routerRoutesFilter(item.children)
    }
    return show
  })
}

/**
 * return flatten routes
 */
export function flattenMenuRoutes(routes: AppRouteObject[]) {
  return routes.reduce<RouteMeta[]>((prev, item) => {
    const { meta, children } = item
    if (meta) prev.push(meta)
    if (children) prev.push(...flattenMenuRoutes(children))
    return prev
  }, [])
}
