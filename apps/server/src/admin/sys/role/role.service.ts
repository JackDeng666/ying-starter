import { Inject, Injectable } from '@nestjs/common'
import { Between, FindOptionsWhere, Like, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { RedisClientType } from 'redis'
import { SysPermissionEntity, SysRoleEntity } from '@/shared/entities'
import { CreateRoleDto, ListRoleDto, UpdateRoleDto } from '@/shared'
import { RedisKey, RedisToken } from '@/modules/redis/constant'

@Injectable()
export class SysRoleService {
  @InjectRepository(SysRoleEntity)
  private readonly sysRoleRepository: Repository<SysRoleEntity>
  @Inject(RedisToken)
  private readonly redisClient: RedisClientType

  async list(listRoleDto: ListRoleDto) {
    const { page, size, name, status, date } = listRoleDto

    const skip = ((page || 1) - 1) * (size || 10)
    const take = size || 10

    const where: FindOptionsWhere<SysRoleEntity> = {
      name: name ? Like(`%${name}%`) : undefined,
      status
    }

    if (date) {
      const startDate = new Date(date[0])
      const endDate = new Date(date[1])
      where.createAt = Between(startDate, new Date(endDate.setDate(endDate.getDate() + 1)))
    }

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

  listCount(listRoleDto: ListRoleDto) {
    const { name, status, date } = listRoleDto

    const where: FindOptionsWhere<SysRoleEntity> = {
      name: name ? Like(`%${name}%`) : undefined,
      status
    }

    if (date) {
      const startDate = new Date(date[0])
      const endDate = new Date(date[1])
      where.createAt = Between(startDate, new Date(endDate.setDate(endDate.getDate() + 1)))
    }
    return this.sysRoleRepository.countBy(where)
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

  delete(id: number) {
    return this.sysRoleRepository.delete(id)
  }
}
