import {
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'

import { FileSourceType, FileType, ListFeedbackDto, ListFileDto } from '@ying/shared'

import { AdminScope, UID } from '@/server/common/decorator'
import { FileService } from '@/server/common/modules/storage/file.service'

import { FeedbackService } from '@/server/business/modules/feedback/feedback.service'

@ApiTags('admin common')
@Controller('admin')
@AdminScope()
export class CommonController {
  constructor(
    readonly fileService: FileService,
    readonly feedbackService: FeedbackService
  ) {}

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
      from: FileSourceType.Admin,
      userId
    })
  }

  @ApiOperation({
    summary: 'get file list'
  })
  @Get('file/list')
  fileList(@Query() dto: ListFileDto) {
    return this.fileService.list(dto)
  }

  @ApiOperation({
    summary: 'get file list count'
  })
  @Get('file/list-count')
  fileListCount(@Query() dto: ListFileDto) {
    return this.fileService.listCount(dto)
  }

  @Get('feedback/list')
  feedbackList(@Query() dto: ListFeedbackDto) {
    return this.feedbackService.list(dto)
  }

  @Get('feedback/list-count')
  feedbackListCount(@Query() dto: ListFeedbackDto) {
    return this.feedbackService.listCount(dto)
  }
}
