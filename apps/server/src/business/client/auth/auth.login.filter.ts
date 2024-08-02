import { ArgumentsHost, Catch, ExceptionFilter, Inject } from '@nestjs/common'
import { Response } from 'express'
import { ConfigType } from '@nestjs/config'
import { authConfig } from '@/server/config'

@Catch()
export class AuthLoginExceptionFilter implements ExceptionFilter {
  @Inject(authConfig.KEY)
  private readonly authConf: ConfigType<typeof authConfig>

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    const message = exception.message ? exception.message : exception.toString()

    response.redirect(this.authConf.redirectUrl + '/auth/error?msg=' + message)
  }
}
