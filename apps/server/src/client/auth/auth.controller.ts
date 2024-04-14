import { Controller, Post, UseGuards, Get, Req, Res, Inject, Body, UseFilters } from '@nestjs/common'
import { ApiBody, ApiTags } from '@nestjs/swagger'
import { Request, Response } from 'express'
import { ConfigType } from '@nestjs/config'
import { authConfig } from '@/server/config'
import { ClientRegisterDto, ForgotPasswordDto, NewPasswordDto, NewVerificationDto } from '@ying/shared'
import { ClientScope, UID, Token } from '@/server/common/decorator'
import { AuthService } from './auth.service'
import { FaceBookAuthGuard, GitHubAuthGuard, GoogleAuthGuard, LocalAuthGuard } from './strategy/authorize.guard'
import { AuthRequest } from './types'
import { AuthLoginExceptionFilter } from './auth.login.filter'

@ApiTags('clien auth')
@Controller('auth')
export class AuthController {
  @Inject()
  private readonly authService: AuthService
  @Inject(authConfig.KEY)
  private readonly authConf: ConfigType<typeof authConfig>

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: AuthRequest) {
    return this.authService.sign(req.user)
  }

  @Post('register')
  @ApiBody({ type: ClientRegisterDto })
  async register(@Body() dto: ClientRegisterDto, @Req() req: Request) {
    return this.authService.register(dto, req.locale)
  }

  @Post('new-verification')
  async newVerification(@Body() dto: NewVerificationDto) {
    return this.authService.newVerification(dto)
  }

  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto, @Req() req: Request) {
    return this.authService.forgotPassword(dto, req.locale)
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
    const accessToken = await this.authService.sign(req.user)
    res.redirect(`${this.authConf.redirectUrl}?access_token=${accessToken}`)
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
    const accessToken = await this.authService.sign(req.user)
    res.redirect(`${this.authConf.redirectUrl}?access_token=${accessToken}`)
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
    const accessToken = await this.authService.sign(req.user)
    res.redirect(`${this.authConf.redirectUrl}?access_token=${accessToken}`)
  }
}
