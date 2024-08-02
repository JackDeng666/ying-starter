import { DataSource, EntitySubscriberInterface, EventSubscriber, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { ConfigType } from '@nestjs/config'
import { Inject } from '@nestjs/common'
import { FileEntity } from '@ying/shared/entities'
import { FileType } from '@ying/shared'
import { storageConfig } from '@/server/config'
import { EXPIR_SECONDS } from './constant'
import { FileService } from './file.service'

@EventSubscriber()
export class FileSubscriber implements EntitySubscriberInterface<FileEntity> {
  constructor(
    dataSource: DataSource,
    @Inject(storageConfig.KEY)
    private readonly storageConf: ConfigType<typeof storageConfig>,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    private readonly fileService: FileService
  ) {
    if (this.storageConf.mode == 'minio') {
      dataSource.subscribers.push(this)
    }
  }

  listenTo() {
    return FileEntity
  }

  async afterLoad(entity: FileEntity) {
    try {
      if (entity.type === FileType.Url) return
      if (Date.now() - new Date(entity.updateAt).getTime() > EXPIR_SECONDS * 1000) {
        const newUrl = await this.fileService.getPresignedUrl(entity.path)
        entity.url = newUrl
        this.fileRepository.update({ id: entity.id }, { url: newUrl })
      }
    } catch (error) {
      console.error(error)
    }
  }
}
