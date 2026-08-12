import { lazy } from 'react'

export const Page403 = lazy(() => import('@/pages/error/Page403'))
export const Page404 = lazy(() => import('@/pages/error/Page404'))
export const Page500 = lazy(() => import('@/pages/error/Page500'))

export const Dashboard = lazy(() => import('@/pages/dashboard/dashboard-page'))
export const User = lazy(() => import('@/pages/user/user-page'))
export const Feedback = lazy(() => import('@/pages/feedback/feedback-page'))
export const Article = lazy(() => import('@/pages/article/article-page'))
export const PushTemplate = lazy(() => import('@/pages/notification/push-template/push-template-page'))
export const PushTask = lazy(() => import('@/pages/notification/push-task/push-task-page'))
export const PushRecord = lazy(() => import('@/pages/notification/push-record/push-record-page'))
export const Visitor = lazy(() => import('@/pages/notification/visitor/visitor-page'))

export const SysRole = lazy(() => import('@/pages/sys/role/role-page'))
export const SysUser = lazy(() => import('@/pages/sys/user/user-page'))
export const SysSetting = lazy(() => import('@/pages/sys/setting/setting-page'))
