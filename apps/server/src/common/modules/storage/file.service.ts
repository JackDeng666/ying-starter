import { Inject, Injectable } from '@nestjs/common'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { ConfigType } from '@nestjs/config'
import { ListFileDto } from '@ying/shared'
import { FileEntity } from '@ying/shared/entities'
import { storageConfig, apiConfig } from '@/server/config'
import { BaseService } from '@/server/common/service/base.service'
import { AbstractFileService, AddFileOptions, UploadFileOptions } from './abstract.file.service'
import { LocalFileService } from './local.file.service'
import { MinioFileService } from './minio.file.service'

@Injectable()
export class FileService extends BaseService<FileEntity> implements AbstractFileService {
  private fileService: AbstractFileService

  constructor(
    @Inject(storageConfig.KEY)
    private readonly storageConf: ConfigType<typeof storageConfig>,
    @Inject(apiConfig.KEY)
    private readonly apiConf: ConfigType<typeof apiConfig>,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    @InjectDataSource()
    private dataSource: DataSource
  ) {
    super(fileRepository)
    if (storageConf.mode === 'local') {
      this.fileService = new LocalFileService(this.dataSource, this.apiConf.url)
    } else if (storageConf.mode === 'minio') {
      this.fileService = new MinioFileService(this.storageConf, this.dataSource)
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

  async deleteFileById(id: number) {
    const file = await this.fileRepository.findOne({ where: { id } })
    return this.deleteFiles([file])
  }
}
