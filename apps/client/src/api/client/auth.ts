import { ClientLoginDto, ClientRegisterDto, NewVerificationDto, ForgotPasswordDto, NewPasswordDto } from '@shared'
import { request } from './request'

export function register(dto: ClientRegisterDto): Promise<string> {
  return request.post('/auth/register', dto)
}

export function newVerification(dto: NewVerificationDto): Promise<string> {
  return request.post('/auth/new-verification', dto)
}

export function login(dto: ClientLoginDto): Promise<string> {
  return request.post('/auth/login', dto)
}

export function logout() {
  return request.get('/auth/logout')
}

export function forgotPassword(dto: ForgotPasswordDto): Promise<string> {
  return request.post('/auth/forgot-password', dto)
}

export function newPassword(dto: NewPasswordDto): Promise<string> {
  return request.post('/auth/new-password', dto)
}
