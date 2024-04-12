import { Inject } from '@nestjs/common'
import { DataSource, EntitySubscriberInterface, EventSubscriber, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { Client } from 'minio'
import { EXPIR_SECONDS, MINIO_TOKEN } from '@/modules/file/constant'
import { FileEntity } from '@ying/shared/entities'
import { ConfigType } from '@nestjs/config'
import { minioConfig } from '@/config'
import { FileType } from '@ying/shared'

@EventSubscriber()
export class FileSubscriber implements EntitySubscriberInterface<FileEntity> {
  constructor(
    dataSource: DataSource,
    @Inject(MINIO_TOKEN)
    private readonly minioClient: Client,
    @InjectRepository(FileEntity)
    private readonly minioFileRepository: Repository<FileEntity>,
    @Inject(minioConfig.KEY)
    private readonly minioCof: ConfigType<typeof minioConfig>
  ) {
    dataSource.subscribers.push(this)
  }

  listenTo() {
    return FileEntity
  }

  async afterLoad(entity: FileEntity) {
    try {
      if (entity.type === FileType.Url) return
      if (Date.now() - new Date(entity.updateAt).getTime() > EXPIR_SECONDS * 1000) {
        const newUrl = await this.minioClient.presignedUrl('get', this.minioCof.bucket, entity.path, EXPIR_SECONDS)
        entity.url = newUrl
        this.minioFileRepository.update({ id: entity.id }, { url: newUrl })
      }
    } catch (error) {
      console.error(error)
    }
  }
}
