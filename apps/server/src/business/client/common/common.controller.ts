import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  Inject,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { RedisClientType } from 'redis'

import {
  CreateFeedbackDto,
  CreateVisitorDto,
  FileSourceType,
  FileType,
  NoticeSubscribeDto,
  ConfigVo
} from '@ying/shared'

import { ClientScope, Public, UID } from '@/server/common/decorator'
import { FileService } from '@/server/common/modules/storage/file.service'
import { RedisKey, RedisToken } from '@/server/common/modules/redis/constant'

import { FeedbackService } from '@/server/business/modules/feedback/feedback.service'
import { VisitorService } from '@/server/business/modules/notification/visitor.service'
import { PushRecordService } from '@/server/business/modules/notification/push.record.service'

@ClientScope()
@Controller('client')
export class CommonController {
  constructor(
    readonly feedbackService: FeedbackService,
    readonly fileService: FileService,
    @Inject(RedisToken)
    readonly redisClient: RedisClientType,
    readonly visitorService: VisitorService,
    readonly pushRecordService: PushRecordService
  ) {}

  @Get('check-live-debug')
  async checkLiveDebug(@UID() userId: number) {
    const configStr = await this.redisClient.get(RedisKey.Config)
    if (!configStr) return false
    const setting = JSON.parse(configStr) as ConfigVo

    return setting.debugUserIds.split(',').includes(userId + '')
  }

  @Post('feedback')
  @Public()
  createFeedback(@Body() dto: CreateFeedbackDto) {
    return this.feedbackService.create(dto)
  }

  @Post('file/image')
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 5 * 1024 * 1024,
            message: 'size must less than 5MB'
          }),
          new FileTypeValidator({ fileType: /image\/(png|jpeg|jpg)/ })
        ]
      })
    )
    file: MulterFile,
    @Body() body: { extra: string },
    @UID() userId: number
  ) {
    return this.fileService.uploadFile({
      file,
      fileType: FileType.Image,
      from: FileSourceType.Client,
      userId,
      extra: JSON.parse(body.extra)
    })
  }

  @Public()
  @Post('visitor')
  async createVisitor(@Body() dto: CreateVisitorDto) {
    return this.visitorService.createVisitor(dto)
  }

  @Public()
  @Post('visitor/subscribe')
  async subscribe(@Body() dto: NoticeSubscribeDto) {
    return this.visitorService.subscribe(dto)
  }

  @Get('visitor/:id/bind')
  async bindUser(@Param('id') id: string, @UID() uid: number) {
    return this.visitorService.bindUser(id, uid)
  }

  @Public()
  @Get('notice/:pushRecordId/click')
  async click(@Param('pushRecordId') pushRecordId: string) {
    return this.pushRecordService.click(pushRecordId)
  }
}
