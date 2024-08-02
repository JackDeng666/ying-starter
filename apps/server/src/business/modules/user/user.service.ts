import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Like, Repository } from 'typeorm'
import { BaseService } from '@/server/common/service/base.service'
import { UserEntity } from '@ying/shared/entities'
import { ListUserDto, ResetPasswordDto, UpdateUserInfoDto } from '@ying/shared'
import { generatePass } from '@/server/common/utils'

@Injectable()
export class UserService extends BaseService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    readonly userRepository: Repository<UserEntity>
  ) {
    super(userRepository)
  }

  list(listUserDto: ListUserDto) {
    const { take, skip, where } = this.buildListQuery(listUserDto)
    const { name, email } = listUserDto

    Object.assign(where, {
      name: name ? Like(`%${name}%`) : undefined,
      email: email ? Like(`%${email}%`) : undefined
    })

    return this.repository.find({
      where,
      skip,
      take,
      relations: ['avatar', 'account'],
      order: {
        createAt: 'DESC'
      }
    })
  }

  listCount(listUserDto: ListUserDto) {
    const { where } = this.buildListQuery(listUserDto)
    const { name, email } = listUserDto

    Object.assign(where, {
      name: name ? Like(`%${name}%`) : undefined,
      email: email ? Like(`%${email}%`) : undefined
    })

    return this.repository.countBy(where)
  }

  findById(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: ['avatar', 'account']
    })
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email }
    })
  }

  updateUserInfo(dto: UpdateUserInfoDto, id: number) {
    return this.userRepository.update({ id }, dto)
  }

  async resetPassword(dto: ResetPasswordDto, id: number) {
    const existingUser = await this.userRepository.findOne({
      where: { id }
    })

    if (existingUser.password && existingUser.password !== generatePass(dto.oldPassword)) {
      throw new InternalServerErrorException('error.old_password_error')
    }

    existingUser.password = generatePass(dto.newPassword)

    await this.userRepository.save(existingUser)
  }
}
