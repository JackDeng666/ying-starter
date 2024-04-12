import { ClientLoginDto, ClientRegisterDto, NewVerificationDto, ForgotPasswordDto, NewPasswordDto } from '@ying/shared'
import { BaseApi } from './request'

export class AuthApi extends BaseApi {
  register(dto: ClientRegisterDto): Promise<string> {
    return this.request.post('/auth/register', dto)
  }

  newVerification(dto: NewVerificationDto): Promise<string> {
    return this.request.post('/auth/new-verification', dto)
  }

  login(dto: ClientLoginDto): Promise<string> {
    return this.request.post('/auth/login', dto)
  }

  logout() {
    return this.request.get('/auth/logout')
  }

  forgotPassword(dto: ForgotPasswordDto): Promise<string> {
    return this.request.post('/auth/forgot-password', dto)
  }

  newPassword(dto: NewPasswordDto): Promise<string> {
    return this.request.post('/auth/new-password', dto)
  }
}
