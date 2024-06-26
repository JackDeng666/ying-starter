import { ReactNode } from 'react'
import { RouteObject } from 'react-router-dom'

import { TPermission } from '@ying/shared/permission/type'

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
   * menu suffix icon
   */
  suffix?: ReactNode
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
   * component string
   */
  component?: string
  /**
   * do not cache in multi tab
   */
  noCache?: boolean
  /**
   * the permission class
   */
  permission?: typeof TPermission
}
export type AppRouteObject = {
  sort?: number
  meta?: RouteMeta
  children?: AppRouteObject[]
} & Omit<RouteObject, 'children'>
