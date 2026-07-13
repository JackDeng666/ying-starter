import { Module } from '@nestjs/common'
import { UserModule as BaseUserModule } from '@/business/modules/user'
import { FeedbackModule as BaseFeedbackModule } from '@/business/modules/feedback'
import { NotificationModule as BaseNotificationModule } from '@/business/modules/notification'
import { CommonController } from './common.controller'
import { UserController } from './user.controller'

@Module({
  imports: [BaseUserModule, BaseFeedbackModule, BaseNotificationModule],
  controllers: [CommonController, UserController]
})
export class CommonModule {}
