import { Module } from '@nestjs/common'
import { FeedbackModule } from '@/server/business/modules/feedback/feedback.module'
import { CommonController } from './common.controller'

@Module({
  imports: [FeedbackModule],
  controllers: [CommonController]
})
export class CommonModule {}
