import { Breadcrumb } from 'antd'
import { ItemType } from 'antd/es/breadcrumb/Breadcrumb'
import { useEffect, useState } from 'react'
import { useMatches } from 'react-router-dom'

import { usePermissionRoutes, useRouter } from '@/admin/router/hooks'
import { menuFilter } from '@/admin/router/utils'

import { AppRouteObject } from '@/admin/types/router'
import { IframeLink } from '@/admin/constant'

/**
 * 动态面包屑解决方案：https://github.com/MinjieChang/myblog/issues/29
 */
export default function BreadCrumb() {
  const matches = useMatches()
  const [breadCrumbs, setBreadCrumbs] = useState<ItemType[]>([])
  const { push } = useRouter()

  const { permissionRoutes, flattenedRoutes } = usePermissionRoutes()

  useEffect(() => {
    const menuRoutes = menuFilter(permissionRoutes)
    const paths = matches.filter(item => item.pathname !== '/').map(item => item.pathname)

    const pathRouteMetas = flattenedRoutes.filter(item => paths.indexOf(item.key) !== -1)

    let items: AppRouteObject[] | undefined = [...menuRoutes]
    const breadCrumbs = pathRouteMetas.map(routeMeta => {
      const { key, label } = routeMeta
      items = items!.find(item => item.meta?.key === key)?.children?.filter(item => !item.meta?.hideMenu)
      const result: ItemType = {
        key,
        title: label
      }
      if (items) {
        result.menu = {
          items: items.map(item => ({
            key: item.meta?.key,
            label: (
              <span
                onClick={() => {
                  if (item.meta?.frameSrc && item.meta.component !== IframeLink) {
                    window.open(item.meta.frameSrc, '_black')
                    return
                  }
                  push(item.meta?.key || '')
                }}
              >
                {item.meta!.label}
              </span>
            )
          }))
        }
      }
      return result
    })
    setBreadCrumbs(breadCrumbs)
  }, [matches, flattenedRoutes, permissionRoutes, push])

  return <Breadcrumb items={breadCrumbs} className="!text-sm" />
}
