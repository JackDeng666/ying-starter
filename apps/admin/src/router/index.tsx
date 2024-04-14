import { Navigate, RouteObject, RouterProvider, createHashRouter } from 'react-router-dom'

import DashboardLayout from '@/admin/layouts/dashboard'
import AuthGuard from '@/admin/router/components/auth-guard'
import Login from '@/admin/pages/login/Login'
import { usePermissionRoutes } from '@/admin/router/hooks'
import { ErrorRoutes } from '@/admin/router/routes/error-routes'
import { AppRouteObject } from '@/admin/types/router'

const { VITE_APP_HOMEPAGE: HOMEPAGE } = import.meta.env
const LoginRoute: AppRouteObject = {
  path: '/login',
  Component: Login
}
const PAGE_NOT_FOUND_ROUTE: AppRouteObject = {
  path: '*',
  element: <Navigate to="/404" replace />
}

export default function Router() {
  const { permissionRoutes } = usePermissionRoutes()
  const asyncRoutes: AppRouteObject = {
    path: '/',
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [{ index: true, element: <Navigate to={HOMEPAGE} replace /> }, ...permissionRoutes]
  }

  const routes = [LoginRoute, asyncRoutes, ErrorRoutes, PAGE_NOT_FOUND_ROUTE]

  const router = createHashRouter(routes as unknown as RouteObject[])
  return <RouterProvider router={router} />
}
