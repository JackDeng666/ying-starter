import { Module } from '@nestjs/common'
import { FeedbackModule } from '@/business/modules/feedback'
import { CommonController } from './common.controller'

@Module({
  imports: [FeedbackModule],
  controllers: [CommonController]
})
export class CommonModule {}
