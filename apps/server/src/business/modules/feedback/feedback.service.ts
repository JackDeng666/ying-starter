import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Like, Repository } from 'typeorm'

import { ListFeedbackDto } from '@ying/shared'
import { FeedbackEntity } from '@ying/shared/entities'

import { BaseService } from '@/server/common/service/base.service'

@Injectable()
export class FeedbackService extends BaseService<FeedbackEntity> {
  constructor(
    @InjectRepository(FeedbackEntity)
    readonly feedbackRepository: Repository<FeedbackEntity>
  ) {
    super(feedbackRepository)
  }

  list(dto: ListFeedbackDto) {
    const { where, take, skip } = this.buildListQuery(dto)
    const { email } = dto

    Object.assign(where, {
      email: email ? Like(`%${email}%`) : undefined
    })

    return this.feedbackRepository.find({
      where,
      skip,
      take,
      order: {
        createAt: 'DESC'
      }
    })
  }

  listCount(dto: ListFeedbackDto) {
    const { where } = this.buildListQuery(dto)
    const { email } = dto

    Object.assign(where, {
      email: email ? Like(`%${email}%`) : undefined
    })

    return this.feedbackRepository.countBy(where)
  }
}
