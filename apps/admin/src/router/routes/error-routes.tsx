import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'

import { CircleLoading } from '@/components/loading'
import SimpleLayout from '@/layouts/simple'
import Page403 from '@/pages/error/Page403'
import Page404 from '@/pages/error/Page404'
import Page500 from '@/pages/error/Page500'

import AuthGuard from '../components/auth-guard'

import { AppRouteObject } from '@/types/router'

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
