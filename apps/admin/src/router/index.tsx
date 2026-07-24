import { Suspense, useEffect } from 'react'
import { Navigate, RouteObject, RouterProvider, createHashRouter } from 'react-router-dom'
import { App } from 'antd'

import DashboardLayout from '@/layouts/dashboard'
import AuthGuard from '@/router/components/auth-guard'
import Login from '@/pages/login'
import { CircleLoading } from '@/components/loading'
import { usePermissionRoutes } from '@/router/hooks'
import { ErrorRoutes } from '@/router/routes/error-routes'
import { AppRouteObject } from '@/types/router'
import { globalEvent } from '@/event-emitter'

const { APP_HOMEPAGE: HOMEPAGE } = import.meta.env

const LoginRoute: AppRouteObject = {
  path: '/login',
  Component: Login
}

export default function Router() {
  const { message } = App.useApp()

  useEffect(() => {
    let currentShowMsg = ''
    function onApiErrorMsg(msg: string | string[]) {
      if (currentShowMsg) return
      if (Array.isArray(msg)) {
        currentShowMsg = msg[0]
      } else {
        currentShowMsg = msg
      }
      message.error(currentShowMsg, undefined, () => (currentShowMsg = ''))
    }
    globalEvent.on('API_ERROR_MSG', onApiErrorMsg)
    return () => {
      globalEvent.off('API_ERROR_MSG', onApiErrorMsg)
    }
  }, [message])

  const { routerRoutes } = usePermissionRoutes()

  const menuRoute: AppRouteObject = {
    path: '/',
    element: (
      <Suspense fallback={<CircleLoading className="h-screen" />}>
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      </Suspense>
    ),
    children: [{ index: true, element: <Navigate to={HOMEPAGE} replace /> }, ...routerRoutes]
  }

  const routes = [LoginRoute, menuRoute, ...ErrorRoutes]

  const router = createHashRouter(routes as unknown as RouteObject[])
  return <RouterProvider router={router} />
}
