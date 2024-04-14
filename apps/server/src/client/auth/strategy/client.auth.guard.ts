import { Reflector } from '@nestjs/core'
import { ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { RedisClientType } from 'redis'
import { Request } from 'express'
import { ExtractJwt } from 'passport-jwt'
import { getLocale } from '@/server/i18n'
import { CLIENT_SCOPE } from '@/server/common/decorator'
import { RedisKey, RedisToken } from '@/server/modules/redis/constant'
import { IS_PUBLIC_KEY } from '@/server/common/decorator/public.decorator'
import { JWT_STRATEGY } from './jwt.strategy'

@Injectable()
export class ClientAuthGuard extends AuthGuard(JWT_STRATEGY) {
  constructor(
    private reflector: Reflector,
    @Inject(RedisToken)
    private readonly redisClient: RedisClientType
  ) {
    super()
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>()
    request.locale = getLocale(request.headers)

    const handler = context.getHandler()
    const classContext = context.getClass()

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [handler, classContext])
    if (isPublic) {
      return true
    }

    const isClienScope = this.reflector.getAllAndOverride<boolean>(CLIENT_SCOPE, [handler, classContext])
    if (!isClienScope) {
      return true
    }

    const canActive = await super.canActivate(context)
    if (canActive) {
      const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request)
      const existsToken = await this.redisClient.get(`${RedisKey.ClientToken}:${request.user?.id}:${token}`)
      if (!existsToken) throw new UnauthorizedException()
      request.token = token
    }

    return true
  }
}
