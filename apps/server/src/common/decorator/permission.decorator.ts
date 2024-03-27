import { SetMetadata } from '@nestjs/common'
import { TPermission } from '@/common/permission/type'

export const PERMISSION_SIGN = 'permission_sign'

export const PermissionDecorator = (permission: TPermission) => SetMetadata(PERMISSION_SIGN, permission)
