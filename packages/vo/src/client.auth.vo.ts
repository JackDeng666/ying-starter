import type { UserEntity } from '@ying/entity'
import { BaseVo } from './base.vo'

export type ClientUserVo = UserEntity & {
  hasPassword: boolean
}

export type ClientAuthVo = {
  accessToken: string
  refreshToken: string
}

export type ClientLoginVo = BaseVo<0, ClientAuthVo> | BaseVo<'emailNotVerified', undefined>
