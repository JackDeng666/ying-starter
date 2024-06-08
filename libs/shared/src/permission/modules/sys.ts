import { TMeta } from '../type'

export class sys {
  static meta: TMeta = {
    label: '系统管理',
    code: 'sys'
  }
  static role = class {
    static meta: TMeta = {
      label: '系统角色',
      code: 'sys:role'
    }
    static create = class {
      static meta: TMeta = {
        label: '创建系统角色',
        code: 'sys:role:create'
      }
    }
    static update = class {
      static meta: TMeta = {
        label: '更新系统角色',
        code: 'sys:role:update'
      }
    }
    static delete = class {
      static meta: TMeta = {
        label: '删除系统角色',
        code: 'sys:role:delete'
      }
    }
  }
  static user = class {
    static meta: TMeta = {
      label: '系统用户',
      code: 'sys:user'
    }
    static create = class {
      static meta: TMeta = {
        label: '创建系统用户',
        code: 'sys:user:create'
      }
    }
    static update = class {
      static meta: TMeta = {
        label: '更新系统用户',
        code: 'sys:user:update'
      }
    }
    static delete = class {
      static meta: TMeta = {
        label: '删除系统用户',
        code: 'sys:user:delete'
      }
    }
  }
  static setting = class {
    static meta: TMeta = {
      label: '系统设置',
      code: 'sys:setting'
    }
    static clearPermissionCache = class {
      static meta: TMeta = {
        label: '清除系统权限缓存',
        code: 'sys:setting:clear-permission-cache'
      }
    }
    static clearDriftFile = class {
      static meta: TMeta = {
        label: '清除游离文件',
        code: 'sys:setting:clear-drift-file'
      }
    }
  }
}
