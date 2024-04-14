import { Inject, Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, VerifyCallback } from 'passport-google-oauth20'
import { ConfigType } from '@nestjs/config'
import { apiConfig, authConfig } from '@/server/config'
import { AuthService } from '../auth.service'

export const GOOGLE_STRATEGY = 'google'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, GOOGLE_STRATEGY) {
  constructor(
    private readonly authService: AuthService,
    @Inject(apiConfig.KEY)
    private readonly apiConf: ConfigType<typeof apiConfig>,
    @Inject(authConfig.KEY)
    private readonly authConf: ConfigType<typeof authConfig>
  ) {
    super({
      clientID: authConf.googleId,
      clientSecret: authConf.googleSecret,
      callbackURL: `${apiConf.url}/api/client/auth/google/callback`,
      scope: ['email', 'profile']
    })
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
    const user = await this.authService.getUser(profile, GOOGLE_STRATEGY)
    done(null, user)
  }
}
