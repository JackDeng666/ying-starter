import { Body, Controller, Get, Post } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { AdminLoginDto } from '@ying/shared'
import { AdminScope, Public, Token, UID } from '@/server/common/decorator'
import { SysAuthService } from './auth.service'

@ApiTags('admin auth')
@Controller('auth')
@AdminScope()
export class SysAuthController {
  constructor(private readonly authService: SysAuthService) {}

  @ApiOperation({
    summary: 'login'
  })
  @Post('login')
  @Public()
  login(@Body() loginDto: AdminLoginDto) {
    return this.authService.login(loginDto)
  }

  @ApiOperation({
    summary: 'logout'
  })
  @Get('logout')
  logout(@Token() token: string, @UID() uid: number) {
    return this.authService.logout(token, uid)
  }

  @ApiOperation({
    summary: 'get current user info'
  })
  @Get('user')
  getUserInfo(@UID('adminUid') uid: number) {
    return this.authService.getUserInfo(uid)
  }
}
