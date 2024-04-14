import { UserEntity } from '../../entities'

export type ClientUserVo = UserEntity & {
  hasPassword: boolean
}
