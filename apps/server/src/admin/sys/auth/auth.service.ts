import { Injectable, Inject, NotAcceptableException } from '@nestjs/common'
import { RedisClientType } from 'redis'
import { JwtService } from '@nestjs/jwt'
import { ConfigType } from '@nestjs/config'
import { authConfig } from '@/server/config'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { ms, unique } from '@ying/utils'
import { AdminLoginDto, BasicStatus } from '@ying/shared'
import { SysPermissionEntity, SysUserEntity } from '@ying/shared/entities'
import { comparePass } from '@/server/common/utils'
import { RedisKey, RedisToken } from '@/server/modules/redis/constant'
import { TAdminPayload } from './guard'

@Injectable()
export class SysAuthService {
  @Inject(RedisToken)
  private readonly redisClient: RedisClientType

  @Inject()
  private readonly jwtService: JwtService

  @Inject(authConfig.KEY)
  private readonly authConf: ConfigType<typeof authConfig>

  @InjectRepository(SysUserEntity)
  private readonly sysUserRepository: Repository<SysUserEntity>

  @InjectRepository(SysPermissionEntity)
  private readonly sysPermissionRepository: Repository<SysPermissionEntity>

  async login(loginDto: AdminLoginDto) {
    const user = await this.sysUserRepository.findOne({
      where: [
        {
          account: loginDto.username
        },
        {
          email: loginDto.username
        }
      ]
    })

    if (!user) {
      throw new NotAcceptableException('user is not exists!')
    }

    if (!comparePass(loginDto.password, user.password)) {
      throw new NotAcceptableException('wrong password!')
    }

    const accessToken = await this.sign(user)

    return {
      accessToken,
      refreshToken: accessToken
    }
  }

  async sign(user: SysUserEntity) {
    const payload: TAdminPayload = {
      id: user.id,
      account: user.account,
      name: user.name
    }
    const accessToken = this.jwtService.sign(payload, {
      secret: this.authConf.adminSecret,
      expiresIn: this.authConf.adminExpiresIn
    })
    await this.redisClient.set(`${RedisKey.AdminToken}:${user.id}:${accessToken}`, user.id, {
      EX: ms(this.authConf.adminExpiresIn) / 1000
    })
    return accessToken
  }

  verify(token: string) {
    return this.jwtService.verify(token, {
      secret: this.authConf.adminSecret
    })
  }

  async logout(token: string, uid: number) {
    await this.redisClient.del(`${RedisKey.AdminToken}:${uid}:${token}`)
  }

  async getUserInfo(uid: number): Promise<SysUserEntity> {
    const sysUserEntity = await this.sysUserRepository.findOne({
      where: {
        id: uid
      },
      relations: ['roles', 'roles.permissions', 'avatar']
    })

    if (!sysUserEntity) return

    const roles = sysUserEntity.roles.filter(role => role.status === BasicStatus.ENABLE)
    sysUserEntity.permissions = unique(roles.reduce((prev, cur) => [...prev, ...cur.permissions], []))

    const isSuperAdmin = roles.some(el => el.systemic)
    if (isSuperAdmin) {
      sysUserEntity.permissions = await this.sysPermissionRepository.find()
    }

    sysUserEntity.permissions = sysUserEntity.permissions.sort((a, b) => {
      if (!a.sortId || !b.sortId) {
        return 0
      }
      return a.sortId - b.sortId
    })

    return sysUserEntity
  }
}
