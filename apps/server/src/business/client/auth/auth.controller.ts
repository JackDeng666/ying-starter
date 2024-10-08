import { Controller, Post, UseGuards, Get, Req, Res, Inject, Body, UseFilters } from '@nestjs/common'
import { ApiBody, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { ConfigType } from '@nestjs/config'
import { apiConfig } from '@/server/config'
import {
  ClientAuthVo,
  ClientLoginDto,
  ClientRegisterDto,
  ForgotPasswordDto,
  NewPasswordDto,
  NewVerificationDto
} from '@ying/shared'
import { ClientScope, UID, Token } from '@/server/common/decorator'
import { AuthService } from './auth.service'
import { FaceBookAuthGuard, GitHubAuthGuard, GoogleAuthGuard, LocalAuthGuard } from './strategy/authorize.guard'
import { AuthRequest } from './types'
import { AuthLoginExceptionFilter } from './auth.login.filter'

@ApiTags('client auth')
@Controller('client/auth')
export class AuthController {
  @Inject()
  private readonly authService: AuthService
  @Inject(apiConfig.KEY)
  private readonly apiConf: ConfigType<typeof apiConfig>

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: ClientLoginDto })
  login(@Req() req: AuthRequest): Promise<ClientAuthVo> {
    return this.authService.sign(req.user)
  }

  @Get('refresh')
  refresh(@Token() token: string) {
    return this.authService.refreshToken(token)
  }

  @Post('register')
  async register(@Body() dto: ClientRegisterDto) {
    return this.authService.register(dto)
  }

  @Post('new-verification')
  async newVerification(@Body() dto: NewVerificationDto) {
    return this.authService.newVerification(dto)
  }

  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto)
  }

  @Post('new-password')
  async newPasswordDto(@Body() dto: NewPasswordDto) {
    return this.authService.newPasswordDto(dto)
  }

  @Get('logout')
  @ClientScope()
  async logout(@Token() token: string, @UID() uid: number) {
    return this.authService.logout(token, uid)
  }

  @Get('github')
  @UseGuards(GitHubAuthGuard)
  @UseFilters(AuthLoginExceptionFilter)
  async github() {
    // Initiates the GitHub OAuth2 login flow
  }

  @Get('github/callback')
  @UseGuards(GitHubAuthGuard)
  @UseFilters(AuthLoginExceptionFilter)
  async githubCallback(@Req() req: AuthRequest, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.sign(req.user)
    res.redirect(`${this.apiConf.clientUrl}?access_token=${accessToken}&refresh_token=${refreshToken}`)
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @UseFilters(AuthLoginExceptionFilter)
  googleLogin() {
    // Initiates the Google OAuth2 login flow
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @UseFilters(AuthLoginExceptionFilter)
  async googleLoginCallback(@Req() req: AuthRequest, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.sign(req.user)
    res.redirect(`${this.apiConf.clientUrl}?access_token=${accessToken}&refresh_token=${refreshToken}`)
  }

  @Get('facebook')
  @UseGuards(FaceBookAuthGuard)
  @UseFilters(AuthLoginExceptionFilter)
  facebook() {
    // Initiates the Facebook OAuth 2.0 authentication flow
  }

  @Get('facebook/callback')
  @UseGuards(FaceBookAuthGuard)
  @UseFilters(AuthLoginExceptionFilter)
  async facebookCallback(@Req() req: AuthRequest, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.sign(req.user)
    res.redirect(`${this.apiConf.clientUrl}?access_token=${accessToken}&refresh_token=${refreshToken}`)
  }
}
