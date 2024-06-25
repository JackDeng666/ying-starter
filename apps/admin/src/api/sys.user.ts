import {
  ListSysUserDto,
  CreateSysUserDto,
  UpdateSysUserDto,
  UpdateSysUserPasswordDto,
  UpdateSysUserSelfUserInfoDto,
  UpdateSysUserSelfPasswordDto
} from '@ying/shared'
import { SysUserEntity } from '@ying/shared/entities'
import { request, timeRangeTransform } from './request'

export function list(params: ListSysUserDto): Promise<SysUserEntity[]> {
  return request.get('/sys/user/list', { params: timeRangeTransform(params, 'date') })
}

export function listCount(params: ListSysUserDto): Promise<number> {
  return request.get('/sys/user/list-count', { params: timeRangeTransform(params, 'date') })
}

export function create(data: CreateSysUserDto) {
  return request.post('/sys/user', data)
}

export function update(data: UpdateSysUserDto) {
  return request.put('/sys/user', data)
}

export function del(id: number) {
  return request.delete(`/sys/user/${id}`)
}

export function updatePassword(data: UpdateSysUserPasswordDto) {
  return request.put('/sys/user/password', data)
}

export function updateSelfInfo(data: UpdateSysUserSelfUserInfoDto) {
  return request.put('/sys/user/self-info', data)
}

export function updateSelfPassword(data: UpdateSysUserSelfPasswordDto) {
  return request.put('/sys/user/self-password', data)
}
