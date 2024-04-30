import { Reflector } from '@nestjs/core'
import { ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'
import { ExtractJwt } from 'passport-jwt'
import { getLocale } from '@/server/i18n'
import { CLIENT_SCOPE } from '@/server/common/decorator'
import { IS_PUBLIC_KEY } from '@/server/common/decorator/public.decorator'
import { JWT_STRATEGY } from './jwt.strategy'

@Injectable()
export class ClientAuthGuard extends AuthGuard(JWT_STRATEGY) {
  constructor(private reflector: Reflector) {
    super()
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>()

    request.locale = getLocale(request.headers)

    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request)
    request.token = token

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

    return super.canActivate(context)
  }
}
