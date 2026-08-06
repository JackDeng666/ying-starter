import { ReactNode } from 'react'
import { RouteObject } from 'react-router-dom'

import type { TPermission } from '@ying/permission'

export type RouteMeta = {
  /**
   * antd menu selectedKeys
   */
  key: string
  /**
   * menu label, i18n
   */
  label: string
  /**
   * menu prefix icon
   */
  icon?: ReactNode
  /**
   * hide in menu
   */
  hideMenu?: boolean
  /**
   * hide in multi tab
   */
  hideTab?: boolean
  /**
   * disable in menu
   */
  disabled?: boolean
  /**
   * react router outlet
   */
  outlet?: any
  /**
   * use to refresh tab
   */
  timeStamp?: string
  /**
   * external link and iframe need
   */
  frameSrc?: string
  /**
   * do not cache in multi tab
   */
  noCache?: boolean
  /**
   * the permission object
   */
  permission?: TPermission
}
export type AppRouteObject = {
  sort?: number
  meta?: RouteMeta
  children?: AppRouteObject[]
} & Omit<RouteObject, 'children'>
