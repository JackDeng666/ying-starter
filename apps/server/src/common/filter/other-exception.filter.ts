import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common'

@Catch()
export class OtherExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()

    const res = {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.toString()
    }

    Logger.error(res, OtherExceptionFilter.name)

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(res)
  }
}
