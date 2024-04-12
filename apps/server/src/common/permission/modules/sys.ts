import { PermissionType } from '@ying/shared'
import { TMeta } from '../type'

export class sys {
  static meta: TMeta = {
    label: '系统管理',
    icon: 'solar:code-scan-bold-duotone',
    type: PermissionType.CATALOGUE,
    code: 'sys',
    route: 'sys'
  }
  static permission = class {
    static meta: TMeta = {
      label: '系统权限',
      icon: 'solar:chart-2-bold-duotone',
      type: PermissionType.MENU,
      code: 'sys:permission',
      route: 'permission',
      component: '/sys/permission/index.tsx'
    }
    static createOrUpdate = class {
      static meta: TMeta = {
        label: '创建或更新系统权限',
        type: PermissionType.BUTTON,
        code: 'sys:permission:createOrUpdate'
      }
    }
    static delete = class {
      static meta: TMeta = {
        label: '删除系统权限',
        type: PermissionType.BUTTON,
        code: 'sys:permission:delete'
      }
    }
  }
  static role = class {
    static meta: TMeta = {
      label: '系统角色',
      icon: 'solar:share-circle-bold-duotone',
      type: PermissionType.MENU,
      code: 'sys:role',
      route: 'role',
      component: '/sys/role/index.tsx'
    }
    static create = class {
      static meta: TMeta = {
        label: '创建系统角色',
        type: PermissionType.BUTTON,
        code: 'sys:role:create'
      }
    }
    static update = class {
      static meta: TMeta = {
        label: '更新系统角色',
        type: PermissionType.BUTTON,
        code: 'sys:role:update'
      }
    }
    static delete = class {
      static meta: TMeta = {
        label: '删除系统角色',
        type: PermissionType.BUTTON,
        code: 'sys:role:delete'
      }
    }
  }
  static user = class {
    static meta: TMeta = {
      label: '系统用户',
      icon: 'solar:shield-user-bold-duotone',
      type: PermissionType.MENU,
      code: 'sys:user',
      route: 'user',
      component: '/sys/user/index.tsx'
    }
    static create = class {
      static meta: TMeta = {
        label: '创建系统用户',
        type: PermissionType.BUTTON,
        code: 'sys:user:create'
      }
    }
    static update = class {
      static meta: TMeta = {
        label: '更新系统用户',
        type: PermissionType.BUTTON,
        code: 'sys:user:update'
      }
    }
    static delete = class {
      static meta: TMeta = {
        label: '删除系统用户',
        type: PermissionType.BUTTON,
        code: 'sys:user:delete'
      }
    }
  }
  static setting = class {
    static meta: TMeta = {
      label: '系统设置',
      icon: 'ic-setting',
      type: PermissionType.MENU,
      code: 'sys:setting',
      route: 'setting',
      component: '/sys/setting/index.tsx'
    }
    static clearPermissionCache = class {
      static meta: TMeta = {
        label: '清除系统权限缓存',
        type: PermissionType.BUTTON,
        code: 'sys:setting:clear-permission-cache'
      }
    }
    static clearDriftFile = class {
      static meta: TMeta = {
        label: '清除游离文件',
        type: PermissionType.BUTTON,
        code: 'sys:setting:clear-drift-file'
      }
    }
  }
}
