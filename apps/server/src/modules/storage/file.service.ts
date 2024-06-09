import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ConfigType } from '@nestjs/config'
import { FileEntity } from '@ying/shared/entities'
import { storageConfig } from '@/server/config'
import { BaseService } from '@/server/common/service/base.service'
import { AbstractFileService, AddFileOptions, UploadFileOptions } from './abstract.file.service'
import { LocalFileService } from './local.file.service'
import { MinioFileService } from './minio.file.service'
import { ListFileDto } from '@ying/shared'

@Injectable()
export class FileService extends BaseService<FileEntity> implements AbstractFileService {
  private fileService: AbstractFileService

  constructor(
    @Inject(storageConfig.KEY)
    private readonly storageConf: ConfigType<typeof storageConfig>,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>
  ) {
    super(fileRepository)
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

  list(dto: ListFileDto) {
    const { take, skip, where } = this.buildListQuery(dto)
    const { type, from } = dto

    Object.assign(where, {
      type,
      from
    })

    return this.repository.find({
      where,
      skip,
      take,
      relations: [],
      order: {
        createAt: 'DESC'
      }
    })
  }

  listCount(dto: ListFileDto) {
    const { where } = this.buildListQuery(dto)
    const { type, from } = dto

    Object.assign(where, {
      type,
      from
    })

    return this.repository.countBy(where)
  }
}
