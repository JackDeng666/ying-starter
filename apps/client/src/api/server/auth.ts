import { UserEntity } from '@ying/shared/entities'
import { serverFetch } from './fetch'

export const getProfile = async (): Promise<UserEntity> => {
  return serverFetch(`/user/profile`)
}
