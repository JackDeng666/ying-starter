import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ResetPasswordDto, UpdateUserInfoDto } from '@ying/shared'
import { UserEntity } from '@ying/shared/entities'
import { generatePass } from '@/server/common/utils'

@Injectable()
export class UserService {
  @InjectRepository(UserEntity)
  private readonly userRepository: Repository<UserEntity>

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
