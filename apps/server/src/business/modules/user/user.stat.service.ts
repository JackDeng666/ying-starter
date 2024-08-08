import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOperator, Repository } from 'typeorm'

import { StatDto, UserStatType } from '@ying/shared'
import { UserEntity } from '@ying/shared/entities'

import { StatService } from '@/server/common/service/stat.service'

@Injectable()
export class UserStatService extends StatService {
  constructor(
    @InjectRepository(UserEntity)
    readonly userRepository: Repository<UserEntity>
  ) {
    super()
  }

  async getUserGrowthTotal() {
    return this.userRepository.count()
  }

  async getUserGrowthTrendAll(dto: StatDto) {
    const betweenList = this.buildBetweenList(dto)
    const betweens = betweenList.map(el => el.between)

    const data = await this.getUserGrowthTrendByType(betweens)

    return {
      categories: betweenList.map(el => el.splitName),
      list: data.data
    }
  }

  async getUserGrowthTrend(dto: StatDto) {
    const betweenList = this.buildBetweenList(dto)

    const betweens = betweenList.map(el => el.between)

    const types = await Promise.all([
      this.getUserGrowthTrendByType(betweens, UserStatType.register),
      this.getUserGrowthTrendByType(betweens, UserStatType.github),
      this.getUserGrowthTrendByType(betweens, UserStatType.google),
      this.getUserGrowthTrendByType(betweens, UserStatType.facebook)
    ])

    return {
      categories: betweenList.map(el => el.splitName),
      types
    }
  }

  async getUserGrowthTrendByType(betweens: FindOperator<Date>[], name?: UserStatType) {
    const data = await Promise.all(
      betweens.map(between => {
        const builder = this.userRepository.createQueryBuilder('user').leftJoinAndSelect('user.account', 'account')

        builder.where('user.createAt BETWEEN :start AND :end', { start: between.value[0], end: between.value[1] })

        if (name) {
          if (name === UserStatType.register) {
            builder.andWhere('account.userId IS NULL')
          } else {
            builder.andWhere('account.provider = :provider', { provider: name })
          }
        }

        return builder.getCount()
      })
    )

    return {
      name,
      data
    }
  }
}
