import { ListUserDto } from '@ying/shared'
import { UserEntity } from '@ying/shared/entities'
import { request, timeRangeTransform } from './request'

export function list(params: ListUserDto): Promise<UserEntity[]> {
  return request.get('/user/list', { params: timeRangeTransform(params, 'date') })
}

export function listCount(params: ListUserDto): Promise<number> {
  return request.get('/user/list-count', { params: timeRangeTransform(params, 'date') })
}
