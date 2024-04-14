import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import { RedisClientType } from 'redis'
import { PERMISSION_SIGN } from '@/server/common/decorator'
import { TPermission } from '@/server/common/permission/type'
import { RedisKey, RedisToken } from '@/server/modules/redis/constant'
import { SysAuthService } from '@/server/admin/sys/auth/auth.service'
import { BasicStatus } from '@ying/shared'

@Injectable()
export class AdminPermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: SysAuthService,
    @Inject(RedisToken)
    private readonly redisClient: RedisClientType
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const handler = context.getHandler()
    const classContext = context.getClass()

    const handlerPermission = this.reflector.get<typeof TPermission | undefined>(PERMISSION_SIGN, handler)
    const classPermission = this.reflector.get<typeof TPermission | undefined>(PERMISSION_SIGN, classContext)
    const permissions = []
    if (handlerPermission) permissions.push(handlerPermission)
    if (classPermission) permissions.push(classPermission)
    if (!permissions.length) return true

    const permissionCodes = permissions.map(el => el.meta.code)

    const request = context.switchToHttp().getRequest<Request>()
    const userId = request.user?.id
    const KEY = `${RedisKey.AdminPermission}:${userId}`
    const userPermissionCodesStr = await this.redisClient.get(KEY)
    let userPermissionCodes = []

    if (!userPermissionCodesStr) {
      const userInfo = await this.authService.getUserInfo(userId)
      userPermissionCodes = userInfo.permissions.filter(el => el.status === BasicStatus.ENABLE).map(el => el.code)
      this.redisClient.set(KEY, JSON.stringify(userPermissionCodes))
    } else {
      userPermissionCodes = JSON.parse(userPermissionCodesStr)
    }

    if (!permissionCodes.every(el => userPermissionCodes.includes(el))) return false

    return true
  }
}
