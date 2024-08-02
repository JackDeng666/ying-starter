import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  Inject,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'
import { RedisClientType } from 'redis'

import { CreateFeedbackDto, FileSourceType, FileType, SettingDto } from '@ying/shared'

import { ClientScope, Public, UID } from '@/server/common/decorator'
import { FileService } from '@/server/common/modules/storage/file.service'
import { RedisKey, RedisToken } from '@/server/common/modules/redis/constant'

import { FeedbackService } from '@/server/business/modules/feedback/feedback.service'

@ApiTags('client common')
@Controller('client')
@ClientScope()
export class CommonController {
  constructor(
    readonly feedbackService: FeedbackService,
    readonly fileService: FileService,
    @Inject(RedisToken)
    readonly redisClient: RedisClientType
  ) {}

  @Get('check-live-debug')
  async checkLiveDebug(@UID() userId: number) {
    const settingStr = await this.redisClient.get(RedisKey.Setting)
    if (!settingStr) return false
    const setting = JSON.parse(settingStr) as SettingDto

    return setting.debugUserIds.split(',').includes(userId + '')
  }

  @Post('feedback')
  @Public()
  createFeedback(@Body() dto: CreateFeedbackDto) {
    return this.feedbackService.create(dto)
  }

  @ApiOperation({
    summary: 'upload file'
  })
  @Post('file')
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
    @UID() userId: number
  ) {
    return this.fileService.uploadFile({
      file,
      fileType: FileType.Image,
      from: FileSourceType.Client,
      userId
    })
  }
}
