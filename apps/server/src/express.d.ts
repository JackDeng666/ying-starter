import { TAdminPayload } from '@/admin/sys/auth/guard'
import { TClientPayload } from '@/client/auth/strategy/jwt.strategy'

declare module 'express' {
  interface Request {
    token?: string
    user?: TClientPayload | TAdminPayload
    locale?: string
  }
}
