import { Suspense } from 'react'
import { Navigate, RouteObject, RouterProvider, createHashRouter } from 'react-router-dom'

import DashboardLayout from '@/admin/layouts/dashboard'
import AuthGuard from '@/admin/router/components/auth-guard'
import Login from '@/admin/pages/login/Login'
import { CircleLoading } from '@/admin/components/loading'
import { usePermissionRoutes } from '@/admin/router/hooks'
import { ErrorRoutes } from '@/admin/router/routes/error-routes'
import { AppRouteObject } from '@/admin/types/router'

const { VITE_APP_HOMEPAGE: HOMEPAGE } = import.meta.env

const LoginRoute: AppRouteObject = {
  path: '/login',
  Component: Login
}

export default function Router() {
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
