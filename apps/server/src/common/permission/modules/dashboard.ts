import { PermissionType } from '@/shared'
import { TMeta } from '../type'

export class dashboard {
  static meta: TMeta = {
    label: '首页',
    icon: 'ic-analysis',
    type: PermissionType.MENU,
    code: 'dashboard',
    route: 'dashboard',
    component: '/dashboard/index.tsx'
  }
}
