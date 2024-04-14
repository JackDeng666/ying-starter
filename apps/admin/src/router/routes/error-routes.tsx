import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'

import { CircleLoading } from '@/admin/components/loading'
import SimpleLayout from '@/admin/layouts/simple'
import Page403 from '@/admin/pages/error/Page403'
import Page404 from '@/admin/pages/error/Page404'
import Page500 from '@/admin/pages/error/Page500'

import AuthGuard from '../components/auth-guard'

import { AppRouteObject } from '@/admin/types/router'

/**
 * error routes
 * 403, 404, 500
 */
export const ErrorRoutes: AppRouteObject = {
  element: (
    <AuthGuard>
      <SimpleLayout>
        <Suspense fallback={<CircleLoading />}>
          <Outlet />
        </Suspense>
      </SimpleLayout>
    </AuthGuard>
  ),
  children: [
    { path: '403', element: <Page403 /> },
    { path: '404', element: <Page404 /> },
    { path: '500', element: <Page500 /> }
  ]
}
