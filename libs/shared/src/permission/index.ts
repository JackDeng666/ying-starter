import { SysPermissionEntity } from '@ying/shared/entities'
import { dashboard } from './modules/dashboard'
import { sys } from './modules/sys'
import { user } from './modules/user'

export const pms = {
  dashboard,
  user,
  sys
}

let sortId = 1

export function gennerate(permission: typeof pms, parentCode: string | null) {
  const arr: SysPermissionEntity[] = []
  Object.keys(permission).forEach(key => {
    if (key !== 'meta') {
      const ob = {
        ...permission[key].meta,
        sortId,
        parentCode
      }
      sortId++
      const children = gennerate(permission[key], permission[key].meta.code)
      if (children.length) {
        ob.children = children
      }
      arr.push(ob)
    }
  })
  return arr
}

export function getPermissionTree(): SysPermissionEntity[] {
  sortId = 1
  return gennerate(pms, null)
}
