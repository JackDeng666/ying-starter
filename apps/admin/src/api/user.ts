import { ListUserDto } from '@shared'
import { UserEntity } from '@shared/entities'
import { request } from './request'

export function list(data: ListUserDto): Promise<UserEntity[]> {
  return request.get('/user/list', { params: data })
}

export function listCount(data: ListUserDto): Promise<number> {
  return request.get('/user/list-count', { params: data })
}
