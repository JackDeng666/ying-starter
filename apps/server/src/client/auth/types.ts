import { Request } from 'express'
import { UserEntity } from '@/shared/entities'

export type AuthRequest = Request & {
  user: UserEntity
}
