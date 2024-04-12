import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Between, FindOptionsWhere, Like, Repository } from 'typeorm'
import { UserEntity } from '@ying/shared/entities'
import { ListUserDto } from '@ying/shared'

@Injectable()
export class UserService {
  @InjectRepository(UserEntity)
  private readonly userRepository: Repository<UserEntity>

  list(listUserDto: ListUserDto) {
    const { page, size, name, email, date } = listUserDto

    const skip = ((page || 1) - 1) * (size || 10)
    const take = size || 10

    const where: FindOptionsWhere<UserEntity> = {
      name: name ? Like(`%${name}%`) : undefined,
      email: email ? Like(`%${email}%`) : undefined
    }

    if (date) {
      const startDate = new Date(date[0])
      const endDate = new Date(date[1])
      where.createAt = Between(startDate, new Date(endDate.setDate(endDate.getDate() + 1)))
    }

    return this.userRepository.find({
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
    const { name, email, date } = listUserDto

    const where: FindOptionsWhere<UserEntity> = {
      name: name ? Like(`%${name}%`) : undefined,
      email: email ? Like(`%${email}%`) : undefined
    }

    if (date) {
      const startDate = new Date(date[0])
      const endDate = new Date(date[1])
      where.createAt = Between(startDate, new Date(endDate.setDate(endDate.getDate() + 1)))
    }

    return this.userRepository.countBy(where)
  }
}
