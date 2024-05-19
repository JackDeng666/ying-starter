import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Like, Repository } from 'typeorm'
import { BaseService } from '@/server/common/service/base.service'
import { UserEntity } from '@ying/shared/entities'
import { ListUserDto } from '@ying/shared'

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
}
