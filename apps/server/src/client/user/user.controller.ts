import { Body, Controller, Get, Put, Request, UnauthorizedException } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ClientScope } from '@/common/decorator'
import { AuthRequest } from '@/client/auth/types'
import { UserService } from './user.service'
import { ClientUserVo, ResetPasswordDto, UpdateUserInfoDto } from '@ying/shared'

@ApiTags('clien user')
@Controller('user')
@ClientScope()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getProfile(@Request() req: AuthRequest): Promise<ClientUserVo> {
    const user = await this.userService.findById(req.user.id)
    if (!user) throw new UnauthorizedException()
    return {
      ...user,
      password: undefined,
      hasPassword: Boolean(user.password)
    }
  }

  @Put()
  updateUserInfo(@Body() dto: UpdateUserInfoDto, @Request() req: AuthRequest) {
    return this.userService.updateUserInfo(dto, req.user.id)
  }

  @Put('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto, @Request() req: AuthRequest) {
    return this.userService.resetPassword(dto, req.user.id)
  }
}
