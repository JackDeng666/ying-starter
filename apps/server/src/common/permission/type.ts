import { SysPermissionEntity } from '@ying/shared/entities'

export type TMeta = Partial<SysPermissionEntity>

export class TPermission {
  static meta: TMeta
}
