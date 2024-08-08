import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { IsNull, Not, Repository } from 'typeorm'
import { RedisClientType } from 'redis'
import { Queue } from 'bull'
import { InjectQueue } from '@nestjs/bull'

import { DeviceType, SetPushTaskDto, PushTaskStatus, RegisterType, SendNotificationDto } from '@ying/shared'
import { VisitorEntity, PushTemplateEntity, PushTaskEntity, PushRecordEntity } from '@ying/shared/entities'

import { PushService } from '@/server/common/modules/push/push.service'
import { RedisToken } from '@/server/common/modules/redis/constant'

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(VisitorEntity)
    readonly visitorRepository: Repository<VisitorEntity>,
    @InjectRepository(PushTemplateEntity)
    readonly pushTemplateRepository: Repository<PushTemplateEntity>,
    @InjectRepository(PushTaskEntity)
    readonly pushTaskRepository: Repository<PushTaskEntity>,
    @InjectRepository(PushRecordEntity)
    readonly pushRecordRepository: Repository<PushRecordEntity>,
    readonly pushService: PushService,
    @Inject(RedisToken)
    readonly redisClient: RedisClientType,
    @InjectQueue('notification')
    readonly notificationQueue: Queue
  ) {}

  // 测试推送模板，不产生记录
  async sendNotification(dto: SendNotificationDto) {
    const visitor = await this.visitorRepository.findOne({
      where: { id: dto.visitorId }
    })
    if (!visitor || !visitor.pushSubscription) return
    const pushTemplate = await this.pushTemplateRepository.findOne({
      where: { id: Number(dto.pushTemplateId) },
      relations: {
        image: true
      }
    })
    if (!pushTemplate) return
    return this.pushService.sendNotification(visitor.pushSubscription, JSON.stringify(pushTemplate))
  }

  async executePushTask(id: number) {
    const pushTask = await this.pushTaskRepository.findOne({
      where: { id },
      relations: {
        pushTemplate: {
          image: true
        }
      }
    })
    if (pushTask.status === PushTaskStatus.Executing) return

    let visitors: VisitorEntity[] = []
    let deviceType: DeviceType | undefined
    if (pushTask.deviceType !== DeviceType.All) {
      deviceType = pushTask.deviceType
    }

    if (pushTask.registerType === RegisterType.All) {
      visitors = await this.visitorRepository.find({ where: { deviceType, pushSubscription: Not(IsNull()) } })
    } else if (pushTask.registerType === RegisterType.Register) {
      visitors = await this.visitorRepository.find({
        where: { deviceType, pushSubscription: Not(IsNull()), userId: Not(IsNull()) }
      })
    } else if (pushTask.registerType === RegisterType.UnRegister) {
      visitors = await this.visitorRepository.find({
        where: { deviceType, pushSubscription: Not(IsNull()), userId: IsNull() }
      })
    }

    pushTask.status = PushTaskStatus.Executing
    await this.pushTaskRepository.save(pushTask)

    if (!visitors.length) {
      await this.pushTaskRepository.update(pushTask.id, { status: PushTaskStatus.Done })
      return
    }

    await this.redisClient.set(`push_task_${pushTask.id}_process_length`, visitors.length)

    visitors.forEach(visitor =>
      this.notificationQueue.add(
        'pushRecord',
        {
          visitorId: visitor.id,
          pushSubscription: visitor.pushSubscription,
          pushTaskId: pushTask.id,
          pushTemplate: pushTask.pushTemplate
        },
        { removeOnComplete: true }
      )
    )
  }

  async setPuskTask(dto: SetPushTaskDto) {
    if (!dto.time) {
      await this.executePushTask(dto.id)
    } else {
      await this.pushTaskRepository.update(dto.id, { status: PushTaskStatus.WaitExecute, time: dto.time })
      this.executePushTaskByTiming(dto)
    }
  }

  async executePushTaskByTiming(dto: SetPushTaskDto) {
    this.notificationQueue.add(
      'pushTask',
      {
        pushTaskId: dto.id
      },
      { jobId: `pushTask_${dto.id}`, delay: new Date(dto.time).getTime() - Date.now(), removeOnComplete: true }
    )
  }

  async stopTimingPushTask(id: number) {
    await this.notificationQueue.removeJobs(`pushTask_${id}`)
    await this.pushTaskRepository.update(id, { status: PushTaskStatus.Wait, time: null })
  }
}
