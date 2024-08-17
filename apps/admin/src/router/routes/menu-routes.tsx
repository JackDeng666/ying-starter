import { Suspense, lazy } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { pms } from '@ying/shared/permission'

import { AppRouteObject } from '@/admin/types/router'
import { CircleLoading } from '@/admin/components/loading'

const Dashbord = lazy(() => import('@/admin/pages/dashboard'))
const User = lazy(() => import('@/admin/pages/user'))
const Feedback = lazy(() => import('@/admin/pages/feedback'))
const Article = lazy(() => import('@/admin/pages/article/article-page'))
const PushTemplate = lazy(() => import('@/admin/pages/notification/push-template/push-template-page'))
const PushTask = lazy(() => import('@/admin/pages/notification/push-task/push-task-page'))
const PushRecord = lazy(() => import('@/admin/pages/notification/push-record/push-record-page'))
const Visitor = lazy(() => import('@/admin/pages/notification/visitor/visitor-page'))

const SysRole = lazy(() => import('@/admin/pages/sys/role/role-page'))
const SysUser = lazy(() => import('@/admin/pages/sys/user/user-page'))
const SysSetting = lazy(() => import('@/admin/pages/sys/setting/setting-page'))

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
    path: 'feedback',
    meta: {
      icon: 'solar:chat-line-bold-duotone',
      key: '/feedback',
      label: '反馈管理'
    },
    element: <Feedback />
  },
  {
    path: 'article',
    meta: {
      icon: 'solar:book-bookmark-bold-duotone',
      key: '/article',
      label: '文章管理'
    },
    element: <Article />
  },
  {
    path: 'notification',
    element: (
      <Suspense fallback={<CircleLoading />}>
        <Outlet />
      </Suspense>
    ),
    meta: {
      icon: 'solar:bell-bing-bold-duotone',
      key: '/notification',
      label: '通知管理'
    },
    children: [
      {
        index: true,
        element: <Navigate to="role" replace />
      },
      {
        path: 'push-template',
        meta: {
          icon: 'solar:document-bold-duotone',
          key: '/notification/push-template',
          label: '推送模板'
        },
        element: <PushTemplate />
      },
      {
        path: 'push-task',
        meta: {
          icon: 'solar:siren-bold-duotone',
          key: '/notification/push-task',
          label: '推送任务'
        },
        element: <PushTask />
      },
      {
        path: 'push-record',
        meta: {
          icon: 'solar:record-square-bold-duotone',
          key: '/notification/push-record',
          label: '推送记录'
        },
        element: <PushRecord />
      },
      {
        path: 'visitor',
        meta: {
          icon: 'solar:user-hand-up-bold-duotone',
          key: '/notification/visitor',
          label: '浏览用户'
        },
        element: <Visitor />
      }
    ]
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
        element: <SysRole />
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
        element: <SysSetting />
      }
    ]
  }
]
