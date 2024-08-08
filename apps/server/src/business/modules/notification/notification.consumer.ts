import { InjectRepository } from '@nestjs/typeorm'
import { Inject } from '@nestjs/common'
import { Process, Processor } from '@nestjs/bull'
import { Repository } from 'typeorm'
import { Job } from 'bull'
import { RedisClientType } from 'redis'
import { WebPushError, type PushSubscription } from 'web-push'

import { PushRecordStatus, PushTaskStatus } from '@ying/shared'
import { PushRecordEntity, PushTaskEntity, PushTemplateEntity, VisitorEntity } from '@ying/shared/entities'

import { RedisToken } from '@/server/common/modules/redis/constant'
import { PushService } from '@/server/common/modules/push/push.service'

import { NotificationService } from './notification.service'

type TPushRecordJobData = {
  visitorId: string
  pushSubscription: PushSubscription
  pushTaskId: number
  pushTemplate: PushTemplateEntity
}

@Processor('notification')
export class NotificationConsumer {
  constructor(
    @InjectRepository(PushRecordEntity)
    readonly pushRecordRepository: Repository<PushRecordEntity>,
    @InjectRepository(VisitorEntity)
    readonly visitorRepository: Repository<VisitorEntity>,
    @InjectRepository(PushTaskEntity)
    readonly pushTaskRepository: Repository<PushTaskEntity>,
    readonly pushService: PushService,
    @Inject(RedisToken)
    readonly redisClient: RedisClientType,
    readonly notificationService: NotificationService
  ) {}

  @Process('pushRecord')
  async processPushRecord(job: Job<TPushRecordJobData>) {
    const { visitorId, pushSubscription, pushTaskId, pushTemplate } = job.data
    let pushRecord: PushRecordEntity | undefined
    try {
      pushRecord = await this.pushRecordRepository.save(
        this.pushRecordRepository.create({
          visitorId,
          pushSubscription: JSON.stringify(pushSubscription),
          pushTaskId,
          pushTemplate: JSON.stringify(pushTemplate)
        })
      )
      const pushResult = await this.pushService.sendNotification(
        pushSubscription,
        JSON.stringify({
          pushRecordId: pushRecord.id,
          ...pushTemplate
        })
      )
      pushRecord.status = PushRecordStatus.Success
      pushRecord.pushResult = JSON.stringify(pushResult)
      await this.pushRecordRepository.save(pushRecord)
    } catch (error) {
      if (error instanceof WebPushError) {
        pushRecord.pushResult = JSON.stringify(error)
        if (error.statusCode === 410) {
          await this.visitorRepository.update(pushRecord.visitorId, { pushSubscription: null })
        }
      } else {
        pushRecord.pushResult = error + ''
      }
      pushRecord.status = PushRecordStatus.Fail
      await this.pushRecordRepository.save(pushRecord)
    } finally {
      let processLength = Number(await this.redisClient.get(`push_task_${pushTaskId}_process_length`))
      if (processLength !== undefined || processLength !== null) {
        processLength = processLength - 1
        await this.redisClient.set(`push_task_${pushTaskId}_process_length`, processLength)
        if (processLength === 0) {
          await this.pushTaskRepository.update(pushTaskId, { status: PushTaskStatus.Done })
          await this.redisClient.del(`push_task_${pushTaskId}_process_length`)
        }
      }
    }
    return
  }

  @Process('pushTask')
  async processPushTask(job: Job<{ pushTaskId: number }>) {
    const { pushTaskId } = job.data
    await this.notificationService.executePushTask(pushTaskId)
    return
  }
}
