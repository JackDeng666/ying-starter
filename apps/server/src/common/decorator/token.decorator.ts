import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Request } from 'express'

export const Token = createParamDecorator((data: any, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>()
  return request.token
})
