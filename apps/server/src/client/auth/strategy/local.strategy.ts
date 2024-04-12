import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from '@ying/shared/entities'
import { Repository } from 'typeorm'
import { generatePass } from '@/common/utils'

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
      throw new InternalServerErrorException('Email does not exist!')
    }

    if (!existingUser.emailVerified) {
      throw new InternalServerErrorException('The email has not been verified yet!')
    }

    if (existingUser.password !== generatePass(password)) {
      throw new InternalServerErrorException('Password error!')
    }

    return existingUser
  }
}
