import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

import { FileSourceType, FileType, ListFeedbackDto, ListFileDto } from '@ying/shared'

import { AdminScope, UID } from '@/server/common/decorator'
import { FileService } from '@/server/common/modules/storage/file.service'

import { FeedbackService } from '@/server/business/modules/feedback/feedback.service'

@Controller('admin')
@AdminScope()
export class CommonController {
  constructor(
    readonly fileService: FileService,
    readonly feedbackService: FeedbackService
  ) {}

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
      from: FileSourceType.Admin,
      userId,
      extra: JSON.parse(body.extra)
    })
  }

  @Get('file/list')
  fileList(@Query() dto: ListFileDto) {
    return this.fileService.list(dto)
  }

  @Get('file/list-count')
  fileListCount(@Query() dto: ListFileDto) {
    return this.fileService.listCount(dto)
  }

  @Delete('file/:id')
  deleteFile(@Param('id') id: number) {
    return this.fileService.deleteFileById(id)
  }

  @Get('feedback/list')
  feedbackList(@Query() dto: ListFeedbackDto) {
    return this.feedbackService.list(dto)
  }

  @Get('feedback/list-count')
  feedbackListCount(@Query() dto: ListFeedbackDto) {
    return this.feedbackService.listCount(dto)
  }

  @Delete('feedback/:id')
  deleteFeedback(@Param('id') id: number) {
    return this.feedbackService.delete(id)
  }
}
