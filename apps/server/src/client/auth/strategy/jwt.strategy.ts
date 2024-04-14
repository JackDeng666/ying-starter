import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { authConfig } from '@/server/config'

export const JWT_STRATEGY = 'jwt'

export type TClientPayload = {
  id: number
  name: string
  email: string
  avatar?: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, JWT_STRATEGY) {
  constructor(
    @Inject(authConfig.KEY)
    private readonly authConf: ConfigType<typeof authConfig>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: authConf.secret
    })
  }

  async validate(payload: TClientPayload) {
    return payload
  }
}
