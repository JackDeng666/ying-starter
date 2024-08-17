import { Module } from '@nestjs/common'
import { UserModule as BaseUserModule } from '@/server/business/modules/user/user.module'
import { FeedbackModule as BaseFeedbackModule } from '@/server/business/modules/feedback/feedback.module'
import { NotificationModule as BaseNotificationModule } from '@/server/business/modules/notification/notification.module'
import { CommonController } from './common.controller'
import { UserController } from './user.controller'

@Module({
  imports: [BaseUserModule, BaseFeedbackModule, BaseNotificationModule],
  controllers: [CommonController, UserController]
})
export class CommonModule {}
