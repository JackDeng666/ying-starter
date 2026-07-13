import { Body, Controller, Get, Post } from '@nestjs/common'
import { AdminLoginDto } from '@ying/dto'
import { AdminScope, Public, Token, UID } from '@/common/decorator'
import { SysAuthService } from './auth.service'

@Controller('admin/sys/auth')
@AdminScope()
export class SysAuthController {
  constructor(private readonly authService: SysAuthService) {}

  @Post('login')
  @Public()
  login(@Body() loginDto: AdminLoginDto) {
    return this.authService.login(loginDto)
  }

  @Get('refresh')
  @Public()
  refresh(@Token() token: string) {
    return this.authService.refreshToken(token)
  }

  @Get('logout')
  logout(@Token() token: string, @UID() uid: number) {
    return this.authService.logout(token, uid)
  }

  @Get('user')
  getUserInfo(@UID() uid: number) {
    return this.authService.getUserInfo(uid)
  }
}
