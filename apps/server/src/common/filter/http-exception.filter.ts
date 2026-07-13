import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common'
import { Request, Response } from 'express'
import type { ErrorVo } from '@ying/vo'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const status = exception.getStatus()
    const exceptionRes = exception.getResponse()

    const error = typeof exceptionRes === 'string' ? { message: exceptionRes } : (exceptionRes as any)

    const ctx = host.switchToHttp()
    const request = ctx.getRequest<Request>()

    const res: ErrorVo = {
      status,
      message: error.message,
      path: request.url,
      timestamp: new Date().toISOString()
    }

    Logger.error(res, HttpExceptionFilter.name)

    ctx.getResponse<Response>().status(status).json(res)
  }
}
