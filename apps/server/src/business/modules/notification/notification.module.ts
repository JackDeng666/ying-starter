import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BullModule } from '@nestjs/bull'

import { VisitorEntity, PushTemplateEntity, PushTaskEntity, PushRecordEntity } from '@ying/shared/entities'

import { VisitorService } from './visitor.service'
import { PushTemplateService } from './push.template.service'
import { PushTaskService } from './push.task.service'
import { PushRecordService } from './push.record.service'
import { NotificationService } from './notification.service'
import { NotificationConsumer } from './notification.consumer'

@Module({
  imports: [
    TypeOrmModule.forFeature([VisitorEntity, PushTemplateEntity, PushTaskEntity, PushRecordEntity]),
    BullModule.registerQueue({
      name: 'notification'
    })
  ],
  providers: [
    VisitorService,
    PushTemplateService,
    PushTaskService,
    PushRecordService,
    NotificationService,
    NotificationConsumer
  ],
  exports: [VisitorService, PushTemplateService, PushTaskService, PushRecordService, NotificationService]
})
export class NotificationModule {}
