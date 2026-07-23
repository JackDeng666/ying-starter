import { Module } from '@nestjs/common'
import { FeedbackModule } from '@/business/modules/feedback'
import { FileController } from './file.controller'
import { FeedbackController } from './feedback.controller'

@Module({
  imports: [FeedbackModule],
  controllers: [FileController, FeedbackController]
})
export class CommonModule {}
