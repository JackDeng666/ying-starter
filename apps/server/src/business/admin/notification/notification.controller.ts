import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import {
  CreatePushTemplateDto,
  ListPushTemplateDto,
  ListVisitorDto,
  SendNotificationDto,
  UpdatePushTemplateDto,
  ListPushTaskDto,
  CreatePushTaskDto,
  UpdatePushTaskDto,
  SetPushTaskDto,
  ListPushRecordDto
} from '@ying/shared'

import { AdminScope } from '@/server/common/decorator'
import { VisitorService } from '@/server/business/modules/notification/visitor.service'
import { PushTemplateService } from '@/server/business/modules/notification/push.template.service'
import { PushTaskService } from '@/server/business/modules/notification/push.task.service'
import { PushRecordService } from '@/server/business/modules/notification/push.record.service'
import { NotificationService } from '@/server/business/modules/notification/notification.service'

@ApiTags('admin notification')
@Controller('admin')
@AdminScope()
export class NotificationController {
  constructor(
    readonly visitorService: VisitorService,
    readonly pushTemplateService: PushTemplateService,
    readonly pushTaskService: PushTaskService,
    readonly pushRecordService: PushRecordService,
    readonly notificationService: NotificationService
  ) {}

  @Get('push-template/list')
  listPushTemplate(@Query() dto: ListPushTemplateDto) {
    return this.pushTemplateService.list(dto)
  }

  @Get('push-template/list-count')
  listPushTemplateCount(@Query() dto: ListPushTemplateDto) {
    return this.pushTemplateService.listCount(dto)
  }

  @Post('push-template')
  createPushTemplate(@Body() dto: CreatePushTemplateDto) {
    return this.pushTemplateService.create(dto)
  }

  @Put('push-template')
  updatePushTemplate(@Body() dto: UpdatePushTemplateDto) {
    return this.pushTemplateService.updateById(dto.id, dto)
  }

  @Get('push-template/:id')
  getPushTemplate(@Param('id') id: number) {
    return this.pushTemplateService.detail(id)
  }

  @Delete('push-template/:id')
  deletePushTemplate(@Param('id') id: number) {
    return this.pushTemplateService.delete(id)
  }

  @Post('notice/send')
  async send(@Body() dto: SendNotificationDto) {
    return this.notificationService.sendNotification(dto)
  }

  @Get('push-task/list')
  listPushTask(@Query() dto: ListPushTaskDto) {
    return this.pushTaskService.list(dto)
  }

  @Get('push-task/list-count')
  listPushTaskCount(@Query() dto: ListPushTaskDto) {
    return this.pushTaskService.listCount(dto)
  }

  @Post('push-task')
  createPushTask(@Body() dto: CreatePushTaskDto) {
    return this.pushTaskService.create(dto)
  }

  @Put('push-task')
  updatePushTask(@Body() dto: UpdatePushTaskDto) {
    return this.pushTaskService.updateById(dto.id, dto)
  }

  @Get('push-task/:id')
  getPushTask(@Param('id') id: number) {
    return this.pushTaskService.detail(id)
  }

  @Delete('push-task/:id')
  deletePushTask(@Param('id') id: number) {
    return this.pushTaskService.delete(id)
  }

  @Post('push-task/set')
  setPushTask(@Body() dto: SetPushTaskDto) {
    return this.notificationService.setPuskTask(dto)
  }

  @Get('push-task/:id/stop-timing')
  stopTimingPushTask(@Param('id') id: number) {
    return this.notificationService.stopTimingPushTask(id)
  }

  @Get('push-record/list')
  listPushRecord(@Query() dto: ListPushRecordDto) {
    return this.pushRecordService.list(dto)
  }

  @Get('push-record/list-count')
  listPushRecordCount(@Query() dto: ListPushRecordDto) {
    return this.pushRecordService.listCount(dto)
  }

  @Get('visitor/list')
  listVisitor(@Query() dto: ListVisitorDto) {
    return this.visitorService.list(dto)
  }

  @Get('visitor/list-count')
  listVisitorCount(@Query() dto: ListVisitorDto) {
    return this.visitorService.listCount(dto)
  }
}
