import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import { RedisClientType } from 'redis'
import { ExtractJwt } from 'passport-jwt'
import { IS_PUBLIC_KEY, ADMIN_SCOPE } from '@/server/common/decorator'
import { RedisKey, RedisToken } from '@/server/modules/redis/constant'
import { SysAuthService } from '@/server/admin/sys/auth/auth.service'

export type TAdminPayload = {
  id: number
  account: string
  name: string
}

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: SysAuthService,
    @Inject(RedisToken)
    private readonly redisClient: RedisClientType
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const handler = context.getHandler()
    const classContext = context.getClass()

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [handler, classContext])
    if (isPublic) {
      return true
    }

    const isAdminScope = this.reflector.getAllAndOverride<boolean>(ADMIN_SCOPE, [handler, classContext])
    if (!isAdminScope) {
      return true
    }

    const request = context.switchToHttp().getRequest<Request>()
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request)
    if (!token) throw new UnauthorizedException()

    let verifyData = undefined
    let existsToken = undefined

    try {
      verifyData = this.authService.verify(token)
      existsToken = await this.redisClient.get(`${RedisKey.AdminToken}:${verifyData.id}:${token}`)
    } catch (error) {
      throw new UnauthorizedException()
    }

    if (!existsToken) throw new UnauthorizedException()

    request.token = token
    request.user = verifyData

    return true
  }
}
