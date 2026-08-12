import { Suspense } from 'react'
import { Navigate } from 'react-router-dom'
import { AppRouteObject } from '@/types/router'
import { CircleLoading } from '@/components/loading'
import SimpleLayout from '@/layouts/simple'

import AuthGuard from '../auth-guard'
import { Page403, Page404, Page500 } from './lazy-pages'

/**
 * error routes
 * 403, 404, 500, *
 */
export const ErrorRoutes: AppRouteObject[] = [
  {
    element: (
      <Suspense fallback={<CircleLoading className="h-screen" />}>
        <AuthGuard>
          <SimpleLayout />
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
