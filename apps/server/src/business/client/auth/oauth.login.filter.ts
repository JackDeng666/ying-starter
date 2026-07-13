import { ArgumentsHost, Catch, ExceptionFilter, Inject } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { Response } from 'express'
import { I18nContext } from 'nestjs-i18n'
import { authConfig } from '@/config'

@Catch()
export class OAuthLoginExceptionFilter implements ExceptionFilter {
  @Inject(authConfig.KEY)
  private readonly authConf: ConfigType<typeof authConfig>

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    const message = exception.message ? exception.message : exception.toString()

    const i18n = I18nContext.current()
    response.redirect(`${this.authConf.authClientUrl}/${i18n?.lang ?? 'en'}/auth/error?msg=${message}`)
  }
}
