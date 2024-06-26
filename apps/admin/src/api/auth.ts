import { request } from './request'
import { AdminLoginDto, UserTokenVo } from '@ying/shared'
import { SysUserEntity } from '@ying/shared/entities'

export function login(data: AdminLoginDto): Promise<UserTokenVo> {
  return request.post('/sys/auth/login', data)
}

export function logout() {
  return request.get('/sys/auth/logout')
}

export function getUserInfo(): Promise<SysUserEntity> {
  return request.get('/sys/auth/user')
}
