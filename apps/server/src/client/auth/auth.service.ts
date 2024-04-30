import { Inject, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { RedisClientType } from 'redis'
import { ConfigType } from '@nestjs/config'
import { nanoid } from 'nanoid'
import { ms } from '@ying/utils'
import {
  ClientAuthVo,
  ClientRegisterDto,
  FileSourceType,
  FileType,
  ForgotPasswordDto,
  NewPasswordDto,
  NewVerificationDto
} from '@ying/shared'
import { authConfig } from '@/server/config'
import { RedisKey, RedisToken } from '@/server/modules/redis/constant'
import { MailService } from '@/server/modules/mail/mail.service'
import { generatePass } from '@/server/common/utils'
import { AccountEntity, FileEntity, UserEntity } from '@ying/shared/entities'
import { TClientPayload } from './strategy/jwt.strategy'
import { i18n } from '@/server/i18n'
import { kMaxLength } from 'buffer'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectDataSource()
    private dataSource: DataSource,
    @Inject(RedisToken)
    private readonly redisClient: RedisClientType,
    @Inject(authConfig.KEY)
    private readonly authConf: ConfigType<typeof authConfig>,
    private readonly mailService: MailService
  ) {}

  async getUser(profile: any, provider: string) {
    const { id, displayName, emails, photos } = profile

    const email = emails[0].value
    const image = photos[0].value

    const existAccount = await this.dataSource.getRepository(AccountEntity).findOne({
      where: { providerAccountId: id, provider },
      relations: ['user', 'user.avatar']
    })

    const existUser = await this.dataSource.getRepository(UserEntity).findOne({
      where: { email }
    })

    if (!existAccount && existUser) throw new InternalServerErrorException('The email has been registered!')

    if (existAccount && existAccount.user) {
      return existAccount.user
    }

    const user = await this.dataSource.transaction(async transaction => {
      const newUser = transaction.create(UserEntity, {
        name: displayName,
        email,
        emailVerified: true
      })
      await transaction.save(newUser)

      const newFile = transaction.create(FileEntity, {
        type: FileType.Url,
        path: image,
        url: image,
        from: FileSourceType.Client,
        userId: newUser.id
      })

      await transaction.save(newFile)

      const newAccount = transaction.create(AccountEntity, {
        type: 'oauth',
        userId: newUser.id,
        provider: provider,
        providerAccountId: id
      })
      await transaction.save(newAccount)

      await transaction.update(UserEntity, { id: newUser.id }, { avatar: newFile })

      newUser.avatar = newFile

      return newUser
    })
    return user
  }

  async sign(user: UserEntity) {
    const payload: TClientPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar?.url
    }
    const accessToken = this.jwtService.sign(payload, {
      secret: this.authConf.secret,
      expiresIn: this.authConf.expiresIn
    })
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.authConf.refreshSecret,
      expiresIn: this.authConf.refreshExpiresIn
    })
    await this.redisClient.set(`${RedisKey.ClientRefreshToken}:${user.id}:${refreshToken}`, user.id, {
      EX: ms(this.authConf.refreshExpiresIn) / 1000
    })
    return {
      accessToken,
      refreshToken
    }
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.authConf.refreshSecret
      })

      const existsToken = await this.redisClient.get(`${RedisKey.ClientRefreshToken}:${payload.id}:${token}`)
      if (!existsToken) throw new UnauthorizedException()

      delete payload.iat
      delete payload.exp

      const accessToken = this.jwtService.sign(payload, {
        secret: this.authConf.secret,
        expiresIn: this.authConf.expiresIn
      })

      return accessToken
    } catch (error) {
      throw new UnauthorizedException()
    }
  }

  async register(dto: ClientRegisterDto, lng: string) {
    await this.dataSource.transaction(async transaction => {
      const existingUser = await transaction.findOne(UserEntity, {
        where: { email: dto.email }
      })

      if (existingUser && existingUser.emailVerified) {
        throw new InternalServerErrorException('The email has been registered!')
      }

      if (existingUser) {
        existingUser.password = generatePass(dto.password)
        existingUser.name = dto.name
        existingUser.emailVerified = false

        await transaction.save(existingUser)
      } else {
        const newUser = transaction.create(UserEntity, {
          ...dto,
          emailVerified: false,
          password: generatePass(dto.password)
        })

        await transaction.save(newUser)
      }

      const token = await this.generateVerificationToken(dto.email)

      const link = `${this.authConf.redirectUrl}/auth/new-verification?token=${token}&email=${dto.email}`

      const t = i18n.getFixedT(lng)

      await this.mailService.sendMail(dto.email, t('confirmEmail'), t('confirmEmailContent', { link }))
    })
  }

  async generateVerificationToken(email: string) {
    const existingTokenKeys = await this.redisClient.keys(`${RedisKey.VerificationToken}:${email}:*`)

    if (existingTokenKeys) {
      existingTokenKeys.forEach(key => {
        this.redisClient.del(key)
      })
    }

    const token = nanoid()

    await this.redisClient.set(`${RedisKey.VerificationToken}:${email}:${token}`, email, {
      EX: ms('1d') / 1000
    })

    return token
  }

  async newVerification(dto: NewVerificationDto) {
    const token = await this.redisClient.get(`${RedisKey.VerificationToken}:${dto.email}:${dto.token}`)

    if (!token) {
      throw new InternalServerErrorException('Token is invalid!')
    }

    await this.dataSource.getRepository(UserEntity).update({ email: dto.email }, { emailVerified: true })

    await this.redisClient.del(`${RedisKey.VerificationToken}:${dto.email}:${dto.token}`)
  }

  async forgotPassword(dto: ForgotPasswordDto, lng: string) {
    const existingUser = await this.dataSource.getRepository(UserEntity).findOne({
      where: { email: dto.email }
    })

    if (!existingUser) {
      throw new InternalServerErrorException('Email does not exist!')
    }

    const token = await this.generatePasswordResetToken(dto.email)

    const link = `${this.authConf.redirectUrl}/auth/new-password?token=${token}&email=${dto.email}`

    const t = i18n.getFixedT(lng)

    await this.mailService.sendMail(dto.email, t('resetPassword'), t('resetContent', { link }))
  }

  async newPasswordDto(dto: NewPasswordDto) {
    const token = await this.redisClient.get(`${RedisKey.PasswordResetToken}:${dto.email}:${dto.token}`)

    if (!token) {
      throw new InternalServerErrorException('Token is invalid!')
    }

    await this.dataSource
      .getRepository(UserEntity)
      .update({ email: dto.email }, { password: generatePass(dto.password) })

    await this.redisClient.del(`${RedisKey.PasswordResetToken}:${dto.email}:${dto.token}`)
  }

  async generatePasswordResetToken(email: string) {
    const existingTokenKeys = await this.redisClient.keys(`${RedisKey.PasswordResetToken}:${email}:*`)

    if (existingTokenKeys) {
      existingTokenKeys.forEach(key => {
        this.redisClient.del(key)
      })
    }

    const token = nanoid()

    await this.redisClient.set(`${RedisKey.PasswordResetToken}:${email}:${token}`, email, {
      EX: ms('5m') / 1000
    })

    return token
  }

  async logout(token: string, uid: number) {
    await this.redisClient.del(`${RedisKey.ClientRefreshToken}:${uid}:${token}`)
  }
}
