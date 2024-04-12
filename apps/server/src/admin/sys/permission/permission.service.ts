import { Inject, Injectable } from '@nestjs/common'
import { TreeRepository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { RedisClientType } from 'redis'
import { createTreeFns } from '@ying/utils'
import { SysPermissionEntity } from '@ying/shared/entities'
import { CreateOrUpdatePermissionDto } from '@ying/shared'
import { RedisKey, RedisToken } from '@/modules/redis/constant'

@Injectable()
export class SysPermissionService {
  @InjectRepository(SysPermissionEntity)
  private readonly sysPermissionRepository: TreeRepository<SysPermissionEntity>
  @Inject(RedisToken)
  private readonly redisClient: RedisClientType

  async list() {
    const list = await this.sysPermissionRepository
      .createQueryBuilder()
      .orderBy('sort', 'DESC')
      .addOrderBy('sortId is null', 'ASC')
      .addOrderBy('sortId', 'ASC')
      .getMany()

    return createTreeFns(list, 'code', 'parentCode').toTree(null)
  }

  async createOrUpdate(dto: CreateOrUpdatePermissionDto) {
    const existPermission = await this.sysPermissionRepository.findOne({
      where: { code: dto.code },
      relations: ['roles', 'roles.users']
    })
    if (!existPermission) {
      const permission = this.sysPermissionRepository.create(dto)

      return this.sysPermissionRepository.save(permission)
    }

    if (existPermission.status !== dto.status) {
      ;[
        ...new Set(
          existPermission.roles
            .map(el => el.users)
            .reduce((prev, cur) => [...prev, ...cur], [])
            .map(user => user.id)
        )
      ].forEach(uid => {
        this.redisClient.del(`${RedisKey.AdminPermission}:${uid}`)
      })
    }

    Object.assign(existPermission, dto)
    return this.sysPermissionRepository.save(existPermission)
  }

  delete(code: string) {
    return this.sysPermissionRepository.delete({ code })
  }
}
