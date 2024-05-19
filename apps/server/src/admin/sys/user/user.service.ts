import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common'
import { Like, Repository } from 'typeorm'
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
import { BaseService } from '@/server/common/service/base.service'

@Injectable()
export class SysUserService extends BaseService<SysUserEntity> {
  constructor(
    @InjectRepository(SysUserEntity)
    readonly sysUserRepository: Repository<SysUserEntity>,
    @Inject(RedisToken)
    readonly redisClient: RedisClientType
  ) {
    super(sysUserRepository)
  }

  async list(dto: ListSysUserDto) {
    const { where, take, skip } = this.buildListQuery(dto)
    const { name, account, status } = dto

    Object.assign(where, {
      name: name ? Like(`%${name}%`) : undefined,
      account: account ? Like(`%${account}%`) : undefined,
      status
    })

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
    const { where } = this.buildListQuery(dto)
    const { name, status, account } = dto

    Object.assign(where, {
      name: name ? Like(`%${name}%`) : undefined,
      account: account ? Like(`%${account}%`) : undefined,
      status
    })

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
