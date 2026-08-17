import type { RouteMeta } from '@/types/router'

export type KeepAliveRoute = RouteMeta & {
  /**
   * react router outlet
   */
  outlet?: any
  /**
   * use to refresh tab
   */
  timeStamp?: string
  hideInFullscreen?: boolean
}
