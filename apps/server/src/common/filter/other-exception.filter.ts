import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common'
import { Request, Response } from 'express'
import type { ErrorVo } from '@ying/vo'

@Catch()
export class OtherExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()

    const request = ctx.getRequest<Request>()

    const res: ErrorVo = {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: exception.message ?? exception.toString(),
      path: request.url,
      timestamp: new Date().toISOString()
    }

    Logger.error(res, OtherExceptionFilter.name)

    ctx.getResponse<Response>().status(HttpStatus.INTERNAL_SERVER_ERROR).json(res)
  }
}
