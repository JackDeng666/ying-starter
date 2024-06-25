import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common'
import { Request, Response } from 'express'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    const status = exception.getStatus()
    const exceptionRes = exception.getResponse()
    if (status === HttpStatus.NOT_FOUND) {
      if (request.url.startsWith('/admin')) {
        response.redirect(process.env.SERVER_URL + '/admin')
        return
      }
    }

    const error = typeof exceptionRes === 'string' ? { message: exceptionRes } : (exceptionRes as object)

    const res = {
      status,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...error
    }

    Logger.error(res, HttpExceptionFilter.name)

    response.status(status).json(res)
  }
}
