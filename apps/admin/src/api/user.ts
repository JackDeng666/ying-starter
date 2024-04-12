import { ListUserDto } from '@ying/shared'
import { UserEntity } from '@ying/shared/entities'
import { request } from './request'

export function list(data: ListUserDto): Promise<UserEntity[]> {
  return request.get('/user/list', { params: data })
}

export function listCount(data: ListUserDto): Promise<number> {
  return request.get('/user/list-count', { params: data })
}
