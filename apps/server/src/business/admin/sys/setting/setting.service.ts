import { RedisClientType } from 'redis'
import { Inject, Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { SysUserEntity, UserEntity } from '@ying/shared/entities'
import { RedisToken, RedisKey } from '@/server/common/modules/redis/constant'
import { FileService } from '@/server/common/modules/storage/file.service'

@Injectable()
export class SysSettingService {
  @InjectDataSource()
  private dataSource: DataSource

  @Inject(RedisToken)
  private readonly redisClient: RedisClientType

  @Inject()
  private readonly fileService: FileService

  async clearPermissionCache() {
    const arr = await this.redisClient.keys(RedisKey.AdminPermission + '*')
    arr.forEach(key => {
      this.redisClient.del(key)
    })
  }

  async clearDriftFile() {
    const sysUserRepository = this.dataSource.getRepository(SysUserEntity)
    const userRepository = this.dataSource.getRepository(UserEntity)

    const sysUsers = await sysUserRepository.find({
      select: ['avatarId']
    })

    const users = await userRepository.find({
      select: ['avatarId']
    })

    const fileIds: number[] = []
    fileIds.push(...sysUsers.map(el => el.avatarId))
    fileIds.push(...users.map(el => el.avatarId))

    await this.fileService.deleteDriftFilesByExcludeIds([...new Set(fileIds)])
  }
}
