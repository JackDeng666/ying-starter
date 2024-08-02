import { Inject, Injectable } from '@nestjs/common'
import { Like, Repository, TreeRepository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { RedisClientType } from 'redis'
import { SysPermissionEntity, SysRoleEntity } from '@ying/shared/entities'
import { CreateRoleDto, ListRoleDto, UpdateRoleDto } from '@ying/shared'
import { createTreeFns } from '@ying/utils'
import { RedisKey, RedisToken } from '@/server/common/modules/redis/constant'
import { BaseService } from '@/server/common/service/base.service'

@Injectable()
export class SysRoleService extends BaseService<SysRoleEntity> {
  constructor(
    @InjectRepository(SysRoleEntity)
    readonly sysRoleRepository: Repository<SysRoleEntity>,
    @InjectRepository(SysPermissionEntity)
    readonly sysPermissionRepository: TreeRepository<SysPermissionEntity>,
    @Inject(RedisToken)
    readonly redisClient: RedisClientType
  ) {
    super(sysRoleRepository)
  }

  async list(dto: ListRoleDto) {
    const { where, take, skip } = this.buildListQuery(dto)
    const { name, status } = dto

    Object.assign(where, {
      name: name ? Like(`%${name}%`) : undefined,
      status
    })

    return this.sysRoleRepository.find({
      where,
      skip,
      take,
      order: {
        createAt: 'DESC'
      },
      relations: ['permissions']
    })
  }

  listCount(dto: ListRoleDto) {
    const { where } = this.buildListQuery(dto)
    const { name, status } = dto

    Object.assign(where, {
      name: name ? Like(`%${name}%`) : undefined,
      status
    })

    return this.sysRoleRepository.countBy(where)
  }

  async listPermissions() {
    const list = await this.sysPermissionRepository
      .createQueryBuilder()
      .addOrderBy('sortId is null', 'ASC')
      .addOrderBy('sortId', 'ASC')
      .getMany()

    return createTreeFns(list, 'code', 'parentCode').toTree(null)
  }

  create(createRoleDto: CreateRoleDto) {
    const role = this.sysRoleRepository.create(createRoleDto)
    role.permissions = createRoleDto.permissionCodes.map(code => {
      const permission = new SysPermissionEntity()
      permission.code = code
      return permission
    })
    return this.sysRoleRepository.save(role)
  }

  async update(updateRoleDto: UpdateRoleDto) {
    const role = await this.sysRoleRepository.findOne({
      where: { id: updateRoleDto.id },
      relations: ['permissions', 'users']
    })
    if (!role) return

    if (role.permissions.map(el => el.code).toString() !== updateRoleDto.permissionCodes.toString()) {
      role.permissions = updateRoleDto.permissionCodes.map(code => {
        const permission = new SysPermissionEntity()
        permission.code = code
        return permission
      })

      role.users.forEach(el => {
        this.redisClient.del(`${RedisKey.AdminPermission}:${el.id}`)
      })
    }

    Object.assign(role, updateRoleDto)
    return this.sysRoleRepository.save(role)
  }
}
