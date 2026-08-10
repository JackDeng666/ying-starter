import { useEffect, useRef, useState } from 'react'
import { useMatches, useOutlet, matchPath } from 'react-router-dom'
import { deepCopy } from '@ying/utils'
import { usePermissionRoutes, useRouter } from '@/router/hooks'
import { KeepAliveRoute } from './type'

export function useCurrentKeepAliveRoute() {
  const [currentKeepAliveRoute, setCurrentKeepAliveRoute] = useState<KeepAliveRoute>()
  const outlet = useOutlet()
  const outletRef = useRef(outlet)
  outletRef.current = outlet
  // 获取所有匹配的路由
  const matchs = useMatches()
  // 获取拍平后的所有路由信息
  const { routeMetas } = usePermissionRoutes()
  const { push } = useRouter()

  useEffect(() => {
    const lastRoute = matchs.at(-1)

    let matchedRoute: KeepAliveRoute | undefined = undefined
    let realTabKey: string | undefined = undefined

    routeMetas.find(item => {
      const matchedPath = matchPath(item.key, lastRoute?.pathname)
      if (matchedPath) {
        matchedRoute = deepCopy(item)
        // 如果匹配成功，且实际路径与配置的路径模式不一致, 如 `/user/:id` 匹配到了 `/user/123`, 则将当前真实的路径 `/user/123` 赋值给变量 realKey
        if (matchedPath.pathname !== matchedPath.pattern.path) {
          realTabKey = matchedPath.pathname
        }
      }
    })

    if (matchedRoute) {
      if (!matchedRoute.hideTab) {
        if (realTabKey) matchedRoute.key = realTabKey
        matchedRoute.outlet = outletRef.current
        setCurrentKeepAliveRoute(matchedRoute)
      }
    } else {
      push(import.meta.env.APP_HOMEPAGE)
    }
  }, [matchs, routeMetas, push])

  return currentKeepAliveRoute
}
