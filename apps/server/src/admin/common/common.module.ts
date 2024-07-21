import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { FeedbackEntity } from '@ying/shared/entities'

import { FeedbackService } from './feedback.service'
import { CommonController } from './common.controller'

@Module({
  imports: [TypeOrmModule.forFeature([FeedbackEntity])],
  controllers: [CommonController],
  providers: [FeedbackService]
})
export class CommonModule {}
