import { useEffect, useState } from 'react'
import { useMatches, useOutlet, matchPath } from 'react-router-dom'

import { usePermissionRoutes } from './use-permission-routes'
import { useRouter } from './use-router'

import { RouteMeta } from '@/admin/types/router'

/**
 * 返回当前路由Meta信息
 */
export function useMatchRouteMeta() {
  const { VITE_APP_HOMEPAGE: HOMEPAGE } = import.meta.env
  const [matchRouteMeta, setMatchRouteMeta] = useState<RouteMeta>()

  // 获取路由组件实例
  const children = useOutlet()

  // 获取所有匹配的路由
  const matchs = useMatches()

  // 获取拍平后的路由菜单
  const { flattenedRoutes } = usePermissionRoutes()

  // const pathname = usePathname();
  const { push } = useRouter()

  useEffect(() => {
    // 获取当前匹配的路由
    // console.log('matchs1', matchs, flattenedRoutes)
    const lastRoute = matchs.at(-1)

    let key: string | undefined = undefined

    const currentRouteMeta = flattenedRoutes.find(item => {
      const matchedPath = matchPath(item.key, lastRoute?.pathname)
      if (matchedPath && matchedPath.pathname !== matchedPath.pattern.path) {
        key = matchedPath.pathname
      }
      return !!matchedPath
    })

    if (currentRouteMeta) {
      if (!currentRouteMeta.hideTab) {
        if (key) {
          const routeMeta: RouteMeta = JSON.parse(JSON.stringify(currentRouteMeta))
          routeMeta.outlet = children
          routeMeta.key = key
          setMatchRouteMeta(routeMeta)
        } else {
          currentRouteMeta.outlet = children
          setMatchRouteMeta(currentRouteMeta)
        }
      }
    } else {
      push(HOMEPAGE)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchs])

  return matchRouteMeta
}
