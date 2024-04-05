import { Inject, Injectable } from '@nestjs/common'
import { Strategy } from 'passport-github2'
import { PassportStrategy } from '@nestjs/passport'
import { ConfigType } from '@nestjs/config'
import { apiConfig, authConfig } from '@/config'
import { AuthService } from '../auth.service'

export const GITHUB_STRATEGY = 'github'

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, GITHUB_STRATEGY) {
  constructor(
    private readonly authService: AuthService,
    @Inject(apiConfig.KEY)
    private readonly apiConf: ConfigType<typeof apiConfig>,
    @Inject(authConfig.KEY)
    private readonly authConf: ConfigType<typeof authConfig>
  ) {
    super({
      clientID: authConf.githubId,
      clientSecret: authConf.githubSecret,
      callbackURL: `${apiConf.url}/api/client/auth/github/callback`,
      scope: ['user:email']
    })
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: any) {
    const user = await this.authService.getUser(profile, GITHUB_STRATEGY)
    done(null, user)
  }
}
