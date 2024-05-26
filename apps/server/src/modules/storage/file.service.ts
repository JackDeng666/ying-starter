import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ConfigType } from '@nestjs/config'
import { FileEntity } from '@ying/shared/entities'
import { storageConfig } from '@/server/config'
import { AbstractFileService, AddFileOptions, UploadFileOptions } from './abstract.file.service'
import { LocalFileService } from './local.file.service'
import { MinioFileService } from './minio.file.service'

@Injectable()
export class FileService implements AbstractFileService {
  private fileService: AbstractFileService

  constructor(
    @Inject(storageConfig.KEY)
    private readonly storageConf: ConfigType<typeof storageConfig>,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>
  ) {
    if (storageConf.mode === 'local') {
      this.fileService = new LocalFileService(this.storageConf, this.fileRepository)
    } else if (storageConf.mode === 'minio') {
      this.fileService = new MinioFileService(this.storageConf, this.fileRepository)
    }
  }

  uploadFile(options: UploadFileOptions) {
    return this.fileService.uploadFile(options)
  }

  addFile(options: AddFileOptions) {
    return this.fileService.addFile(options)
  }

  getPresignedUrl(path: string) {
    return this.fileService.getPresignedUrl(path)
  }

  deleteFiles(files: FileEntity[]) {
    return this.fileService.deleteFiles(files)
  }

  deleteDriftFilesByExcludeIds(excludeIds: number[]) {
    return this.fileService.deleteDriftFilesByExcludeIds(excludeIds)
  }
}
