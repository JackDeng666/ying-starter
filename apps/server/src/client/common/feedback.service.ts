import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

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
}
