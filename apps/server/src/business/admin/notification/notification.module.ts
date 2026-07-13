import { Module } from '@nestjs/common'
import { NotificationModule as BaseNotificationModule } from '@/business/modules/notification'
import { NotificationController } from './notification.controller'

@Module({
  imports: [BaseNotificationModule],
  controllers: [NotificationController]
})
export class NotificationModule {}
