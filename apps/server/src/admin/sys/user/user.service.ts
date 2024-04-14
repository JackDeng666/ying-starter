import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common'
import { Between, FindOptionsWhere, Like, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { RedisClientType } from 'redis'
import { SysRoleEntity, SysUserEntity } from '@ying/shared/entities'
import {
  CreateSysUserDto,
  ListSysUserDto,
  UpdateSysUserDto,
  UpdateSysUserPasswordDto,
  UpdateSysUserSelfPasswordDto,
  UpdateSysUserSelfUserInfoDto
} from '@ying/shared'
import { comparePass, generatePass } from '@/server/common/utils'
import { RedisKey, RedisToken } from '@/server/modules/redis/constant'

@Injectable()
export class SysUserService {
  @InjectRepository(SysUserEntity)
  private readonly sysUserRepository: Repository<SysUserEntity>

  @Inject(RedisToken)
  private readonly redisClient: RedisClientType

  async list(dto: ListSysUserDto) {
    const { page, size, name, account, status, date } = dto

    const skip = ((page || 1) - 1) * (size || 10)
    const take = size || 10

    const where: FindOptionsWhere<SysUserEntity> = {
      name: name ? Like(`%${name}%`) : undefined,
      account: account ? Like(`%${account}%`) : undefined,
      status
    }

    if (date) {
      const startDate = new Date(date[0])
      const endDate = new Date(date[1])
      where.createAt = Between(startDate, new Date(endDate.setDate(endDate.getDate() + 1)))
    }

    return this.sysUserRepository.find({
      where,
      skip,
      take,
      order: {
        createAt: 'DESC'
      },
      relations: ['roles', 'avatar']
    })
  }

  listCount(dto: ListSysUserDto) {
    const { name, status, date } = dto

    const where: FindOptionsWhere<SysUserEntity> = {
      name: name ? Like(`%${name}%`) : undefined,
      status
    }

    if (date) {
      const startDate = new Date(date[0])
      const endDate = new Date(date[1])
      where.createAt = Between(startDate, new Date(endDate.setDate(endDate.getDate() + 1)))
    }
    return this.sysUserRepository.countBy(where)
  }

  async create(dto: CreateSysUserDto) {
    const sysUser = this.sysUserRepository.create(dto)
    sysUser.password = generatePass(dto.password)
    sysUser.roles = dto.roleIds.map(id => {
      const role = new SysRoleEntity()
      role.id = id
      return role
    })
    return this.sysUserRepository.save(sysUser)
  }

  update(dto: UpdateSysUserDto) {
    const user = this.sysUserRepository.create(dto)
    user.roles = dto.roleIds.map(id => {
      const role = new SysRoleEntity()
      role.id = id
      return role
    })
    this.redisClient.del(`${RedisKey.AdminPermission}:${user.id}`)
    return this.sysUserRepository.save(user)
  }

  delete(id: number) {
    return this.sysUserRepository.delete(id)
  }

  updatePassword(dto: UpdateSysUserPasswordDto) {
    const sysUser = this.sysUserRepository.create(dto)
    sysUser.password = generatePass(dto.password)
    return this.sysUserRepository.save(sysUser)
  }

  async updateSelfInfo(dto: UpdateSysUserSelfUserInfoDto, id: number) {
    return this.sysUserRepository.update({ id }, dto)
  }

  async updateSelfPassword(dto: UpdateSysUserSelfPasswordDto, id: number) {
    const user = await this.sysUserRepository.findOne({
      where: { id }
    })
    if (!comparePass(dto.oldPass, user.password)) {
      throw new InternalServerErrorException('The password is incorrect!')
    }

    const sysUser = this.sysUserRepository.create({ id })
    sysUser.password = generatePass(dto.newPass)

    return this.sysUserRepository.save(sysUser)
  }
}
