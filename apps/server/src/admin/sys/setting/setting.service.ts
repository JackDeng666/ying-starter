import { RedisClientType } from 'redis'
import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { RedisToken, RedisKey } from '@/modules/redis/constant'
import { SysUserEntity, UserEntity } from '@ying/shared/entities'
import { FileService } from '@/modules/file/file.service'

@Injectable()
export class SysSettingService {
  @Inject(RedisToken)
  private readonly redisClient: RedisClientType

  @InjectRepository(SysUserEntity)
  private readonly sysUserRepository: Repository<SysUserEntity>

  @InjectRepository(UserEntity)
  private readonly userEntity: Repository<UserEntity>

  @Inject()
  private readonly fileService: FileService

  async clearPermissionCache() {
    const arr = await this.redisClient.keys(RedisKey.AdminPermission + '*')
    arr.forEach(key => {
      this.redisClient.del(key)
    })
  }

  async clearDriftFile() {
    const sysUsers = await this.sysUserRepository.find({
      select: ['avatarId']
    })

    const users = await this.userEntity.find({
      select: ['avatarId']
    })

    const fileIds = []
    fileIds.push(...sysUsers.map(el => el.avatarId))
    fileIds.push(...users.map(el => el.avatarId))

    await this.fileService.deleteDriftFilesByExcludeIds(fileIds)
  }
}
