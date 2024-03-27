import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { RedisClientType } from 'redis'
import { ConfigType } from '@nestjs/config'
import { nanoid } from 'nanoid'
import { ms } from '@ying/utils'
import {
  ClientRegisterDto,
  FileSourceType,
  FileType,
  ForgotPasswordDto,
  NewPasswordDto,
  NewVerificationDto
} from '@/shared'
import { authConfig } from '@/config'
import { RedisKey, RedisToken } from '@/modules/redis/constant'
import { MailService } from '@/modules/mail/mail.service'
import { generatePass } from '@/common/utils'
import { AccountEntity, FileEntity, UserEntity } from '@/shared/entities'
import { TClientPayload } from './strategy/jwt.strategy'

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

    if (!existAccount && existUser) throw new InternalServerErrorException('邮箱已被注册!')

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
    const accessToken = this.jwtService.sign(payload)
    await this.redisClient.set(`${RedisKey.ClientToken}:${user.id}:${accessToken}`, user.id, {
      EX: ms(this.authConf.expiresIn) / 1000
    })
    return accessToken
  }

  async register(dto: ClientRegisterDto) {
    await this.dataSource.transaction(async transaction => {
      const existingUser = await transaction.findOne(UserEntity, {
        where: { email: dto.email }
      })

      if (existingUser) {
        throw new InternalServerErrorException('邮箱已经被注册!')
      }

      const newUser = transaction.create(UserEntity, {
        ...dto,
        emailVerified: false,
        password: generatePass(dto.password)
      })

      await transaction.save(newUser)

      const token = await this.generateVerificationToken(dto.email)

      const confirmLink = `${this.authConf.redirectUrl}/auth/new-verification?token=${token}&email=${dto.email}`

      await this.mailService.sendMail(
        dto.email,
        '确认您的电子邮件',
        `<p>点击这里 <a href="${confirmLink}">here</a> 确认电子邮件，1天内有效.</p>`
      )
    })

    return '确认电子邮件已发送！'
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
      throw new InternalServerErrorException('Token 无效!')
    }

    await this.dataSource.getRepository(UserEntity).update({ email: dto.email }, { emailVerified: true })

    await this.redisClient.del(`${RedisKey.VerificationToken}:${dto.email}:${dto.token}`)

    return '邮箱已验证成功!'
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const existingUser = await this.dataSource.getRepository(UserEntity).findOne({
      where: { email: dto.email }
    })

    if (!existingUser) {
      throw new InternalServerErrorException('邮箱不存在!')
    }

    const token = await this.generatePasswordResetToken(dto.email)

    const link = `${this.authConf.redirectUrl}/auth/new-password?token=${token}&email=${dto.email}`

    await this.mailService.sendMail(
      dto.email,
      '重置您的密码',
      `<p>点击这里 <a href="${link}">here</a> 重置您的密码，5分钟内有效.</p>`
    )

    return '重置密码邮件发送成功!'
  }

  async newPasswordDto(dto: NewPasswordDto) {
    const token = await this.redisClient.get(`${RedisKey.PasswordResetToken}:${dto.email}:${dto.token}`)

    if (!token) {
      throw new InternalServerErrorException('Token 无效!')
    }

    await this.dataSource
      .getRepository(UserEntity)
      .update({ email: dto.email }, { password: generatePass(dto.password) })

    await this.redisClient.del(`${RedisKey.PasswordResetToken}:${dto.email}:${dto.token}`)

    return '密码修改成功!'
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
    await this.redisClient.del(`${RedisKey.ClientToken}:${uid}:${token}`)
  }
}
