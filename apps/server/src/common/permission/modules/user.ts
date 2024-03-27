import { PermissionType } from '@/shared'
import { TMeta } from '../type'

export class user {
  static meta: TMeta = {
    label: '用户管理',
    icon: 'solar:user-bold-duotone',
    type: PermissionType.MENU,
    code: 'user',
    route: 'user',
    component: '/user/index.tsx'
  }
}
