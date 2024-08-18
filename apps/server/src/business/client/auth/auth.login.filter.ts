import { ArgumentsHost, Catch, ExceptionFilter, Inject } from '@nestjs/common'
import { Response } from 'express'
import { ConfigType } from '@nestjs/config'
import { apiConfig } from '@/server/config'

@Catch()
export class AuthLoginExceptionFilter implements ExceptionFilter {
  @Inject(apiConfig.KEY)
  private readonly apiConf: ConfigType<typeof apiConfig>

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    const message = exception.message ? exception.message : exception.toString()

    response.redirect(this.apiConf.clientUrl + '/auth/error?msg=' + message)
  }
}
