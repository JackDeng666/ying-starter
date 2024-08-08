import { Module } from '@nestjs/common'
import { NotificationModule as BaseNotificationModule } from '@/server/business/modules/notification/notification.module'
import { NotificationController } from './notification.controller'

@Module({
  imports: [BaseNotificationModule],
  controllers: [NotificationController]
})
export class NotificationModule {}
