import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ResetPasswordDto, UpdateUserInfoDto } from '@/shared'
import { UserEntity } from '@/shared/entities'
import { generatePass } from '@/common/utils'

@Injectable()
export class UserService {
  @InjectRepository(UserEntity)
  private readonly userRepository: Repository<UserEntity>

  findById(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: ['avatar']
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
      throw new InternalServerErrorException('旧密码错误!')
    }

    existingUser.password = generatePass(dto.newPassword)

    await this.userRepository.save(existingUser)

    return '密码修改成功'
  }
}
