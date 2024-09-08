import { Suspense } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { CircleLoading } from '@/admin/components/loading'
import SimpleLayout from '@/admin/layouts/simple'
import Page403 from '@/admin/pages/error/Page403'
import Page404 from '@/admin/pages/error/Page404'
import Page500 from '@/admin/pages/error/Page500'
import { AppRouteObject } from '@/admin/types/router'

import AuthGuard from '../components/auth-guard'

/**
 * error routes
 * 403, 404, 500, *
 */
export const ErrorRoutes: AppRouteObject[] = [
  {
    element: (
      <Suspense fallback={<CircleLoading className="h-screen" />}>
        <AuthGuard>
          <SimpleLayout>
            <Outlet />
          </SimpleLayout>
        </AuthGuard>
      </Suspense>
    ),
    children: [
      { path: '403', element: <Page403 /> },
      { path: '404', element: <Page404 /> },
      { path: '500', element: <Page500 /> }
    ]
  },
  {
    path: '*',
    element: <Navigate to="/404" replace />
  }
]
