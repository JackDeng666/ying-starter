import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ClientScope, UID } from '@/server/common/decorator'
import { FileService } from '@/server/modules/file/file.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { FileSourceType, FileType } from '@ying/shared'

@ApiTags('client file')
@Controller('client')
@ClientScope()
export class FileController {
  constructor(private readonly fileService: FileService) {}

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
