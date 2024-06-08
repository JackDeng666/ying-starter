import { Suspense, lazy } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { pms } from '@ying/shared/permission'

import { AppRouteObject } from '@/admin/types/router'
import { CircleLoading } from '@/admin/components/loading'

const Dashbord = lazy(() => import('@/admin/pages/dashboard'))
const User = lazy(() => import('@/admin/pages/user'))

const Role = lazy(() => import('@/admin/pages/sys/role'))
const SysUser = lazy(() => import('@/admin/pages/sys/user'))
const Settings = lazy(() => import('@/admin/pages/sys/setting'))

export const menuRoutes: AppRouteObject[] = [
  {
    path: 'dashboard',
    meta: {
      icon: 'ic-analysis',
      key: '/dashboard',
      label: '首页',
      permission: pms.dashboard
    },
    element: <Dashbord />
  },
  {
    path: 'user',
    meta: {
      icon: 'solar:user-bold-duotone',
      key: '/user',
      label: '用户管理',
      permission: pms.user
    },
    element: <User />
  },
  {
    path: 'sys',
    element: (
      <Suspense fallback={<CircleLoading />}>
        <Outlet />
      </Suspense>
    ),
    meta: {
      icon: 'solar:code-scan-bold-duotone',
      key: '/sys',
      label: '系统管理',
      permission: pms.sys
    },
    children: [
      {
        index: true,
        element: <Navigate to="role" replace />
      },
      {
        path: 'role',
        meta: {
          icon: 'solar:share-circle-bold-duotone',
          key: '/sys/role',
          label: '系统角色',
          permission: pms.sys.role
        },
        element: <Role />
      },
      {
        path: 'user',
        meta: {
          icon: 'solar:shield-user-bold-duotone',
          key: '/sys/user',
          label: '系统用户',
          permission: pms.sys.user
        },
        element: <SysUser />
      },
      {
        path: 'setting',
        meta: {
          icon: 'ic-setting',
          key: '/sys/setting',
          label: '系统设置',
          permission: pms.sys.setting
        },
        element: <Settings />
      }
    ]
  }
]
