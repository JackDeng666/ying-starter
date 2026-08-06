import { useEffect, useRef, useState } from 'react'
import { useMatches, useOutlet, matchPath } from 'react-router-dom'
import { deepCopy } from '@ying/utils'
import { RouteMeta } from '@/types/router'
import { usePermissionRoutes } from './use-permission-routes'
import { useRouter } from './use-router'

export function useCurrentRouteMeta() {
  const [currentRouteMeta, setCurrentRouteMeta] = useState<RouteMeta | undefined>()
  const outlet = useOutlet()
  const outletRef = useRef(outlet)
  outletRef.current = outlet
  // 获取所有匹配的路由
  const matchs = useMatches()
  // 获取拍平后的路由菜单
  const { flattenedRoutes } = usePermissionRoutes()
  const { push } = useRouter()

  useEffect(() => {
    const lastRoute = matchs.at(-1)

    let matchedRouteMeta: RouteMeta | undefined = undefined
    let realKey: string | undefined = undefined

    flattenedRoutes.find(item => {
      const matchedPath = matchPath(item.key, lastRoute?.pathname)
      if (matchedPath) {
        matchedRouteMeta = deepCopy(item)
        // 如果匹配成功，且实际路径与配置的路径模式不一致, 如 `/user/:id` 匹配到了 `/user/123`, 则将当前真实的路径 `/user/123` 赋值给变量 realKey
        if (matchedPath.pathname !== matchedPath.pattern.path) {
          realKey = matchedPath.pathname
        }
      }
    })

    if (matchedRouteMeta) {
      if (!matchedRouteMeta.hideTab) {
        if (realKey) matchedRouteMeta.key = realKey
        matchedRouteMeta.outlet = outletRef.current
        setCurrentRouteMeta(matchedRouteMeta)
      }
    } else {
      push(import.meta.env.APP_HOMEPAGE)
    }
  }, [matchs, flattenedRoutes, push])

  return currentRouteMeta
}
