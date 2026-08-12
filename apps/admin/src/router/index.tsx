import { Suspense, useEffect } from 'react'
import { Navigate, RouteObject, RouterProvider, createHashRouter } from 'react-router-dom'
import { App } from 'antd'

import DashboardLayout from '@/layouts/dashboard'
import Login from '@/pages/login'
import { CircleLoading } from '@/components/loading'
import { usePermissionRoutes } from '@/router/hooks'
import { ErrorRoutes } from '@/router/routes/error-routes'
import { AppRouteObject } from '@/types/router'
import { globalEvent } from '@/event-emitter'
import AuthGuard from './auth-guard'

const LoginRoute: AppRouteObject = {
  path: '/login',
  element: <Login />
}

export default function Router() {
  const { message } = App.useApp()

  useEffect(() => {
    let currentShowMsg = ''
    function onApiErrorMsg(msg: string) {
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

  const MenuRoute: AppRouteObject = {
    path: '/',
    element: (
      <Suspense fallback={<CircleLoading className="h-screen" />}>
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      </Suspense>
    ),
    children: [{ index: true, element: <Navigate to={import.meta.env.APP_HOMEPAGE} replace /> }, ...routerRoutes]
  }

  const routes = [LoginRoute, MenuRoute, ...ErrorRoutes]

  const router = createHashRouter(routes as unknown as RouteObject[])
  return <RouterProvider router={router} />
}
