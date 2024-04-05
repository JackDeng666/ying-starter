import { ClientUserVo, ResetPasswordDto, UpdateUserInfoDto } from '@shared'
import { BaseApi } from './request'

export class UserApi extends BaseApi {
  getProfile(): Promise<ClientUserVo> {
    return this.request.get('/user/profile')
  }

  updateUserInfo(dto: UpdateUserInfoDto): Promise<string> {
    return this.request.put('/user', dto)
  }

  resetPassword(dto: ResetPasswordDto): Promise<string> {
    return this.request.put('/user/reset-password', dto)
  }
}
