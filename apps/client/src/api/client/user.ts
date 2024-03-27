import { ClientUserVo, ResetPasswordDto, UpdateUserInfoDto } from '@shared'
import { request } from './request'

export function getProfile(): Promise<ClientUserVo> {
  return request.get('/user/profile')
}

export function updateUserInfo(dto: UpdateUserInfoDto): Promise<string> {
  return request.put('/user', dto)
}

export function resetPassword(dto: ResetPasswordDto): Promise<string> {
  return request.put('/user/reset-password', dto)
}
