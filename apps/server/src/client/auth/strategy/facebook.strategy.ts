import { Inject, Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ConfigType } from '@nestjs/config'
import { Strategy } from 'passport-facebook'
import { apiConfig, authConfig } from '@/server/config'
import { AuthService } from '../auth.service'

export const FACEBOOK_STRATEGY = 'facebook'

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, FACEBOOK_STRATEGY) {
  constructor(
    private readonly authService: AuthService,
    @Inject(apiConfig.KEY)
    private readonly apiConf: ConfigType<typeof apiConfig>,
    @Inject(authConfig.KEY)
    private readonly authConf: ConfigType<typeof authConfig>
  ) {
    super({
      clientID: authConf.facebookId,
      clientSecret: authConf.facebookSecret,
      callbackURL: `${apiConf.url}/api/client/auth/facebook/callback`,
      profileFields: ['id', 'displayName', 'photos', 'emails'],
      scope: ['email']
    })
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: any) {
    const user = await this.authService.getUser(profile, FACEBOOK_STRATEGY)
    done(null, user)
  }
}
