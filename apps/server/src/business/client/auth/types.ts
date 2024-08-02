import { Request } from 'express'
import { UserEntity } from '@ying/shared/entities'

export type AuthRequest = Request & {
  user: UserEntity
}
