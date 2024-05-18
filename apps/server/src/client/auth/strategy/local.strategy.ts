import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from '@ying/shared/entities'
import { Repository } from 'typeorm'
import { generatePass } from '@/server/common/utils'

export const LOCAL_STRATEGY = 'local'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, LOCAL_STRATEGY) {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userReposity: Repository<UserEntity>
  ) {
    super({
      usernameField: 'email'
    })
  }

  async validate(email: string, password: string): Promise<any> {
    const existingUser = await this.userReposity.findOne({
      where: {
        email
      }
    })

    if (!existingUser) {
      throw new InternalServerErrorException('error.email_does_not_exist')
    }

    if (!existingUser.emailVerified) {
      throw new InternalServerErrorException('error.the_email_has_not_been_verified_yet')
    }

    if (existingUser.password !== generatePass(password)) {
      throw new InternalServerErrorException('error.password_error')
    }

    return existingUser
  }
}
