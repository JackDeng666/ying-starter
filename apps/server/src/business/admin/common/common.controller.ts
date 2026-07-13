import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  Inject,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

import { FileSourceType, FileType } from '@ying/shared'
import { ListFileDto, ListFeedbackDto } from '@ying/dto'

import { AdminScope, UID } from '@/common/decorator'
import { FileServiceToken, AbstractFileService } from '@/common/modules/storage'
import { FeedbackService } from '@/business/modules/feedback'

@Controller('admin')
@AdminScope()
export class CommonController {
  constructor(
    @Inject(FileServiceToken)
    readonly fileService: AbstractFileService,
    readonly feedbackService: FeedbackService
  ) {}

  @Post('file/image')
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 6 * 1024 * 1024,
            message: 'size must less than 6MB'
          }),
          new FileTypeValidator({ fileType: /^image\// })
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
