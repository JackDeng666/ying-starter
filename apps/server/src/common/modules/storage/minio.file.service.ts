import { ConfigType } from '@nestjs/config'
import { DataSource, In, Not, Repository } from 'typeorm'
import { Client } from 'minio'
import { nanoid } from 'nanoid'
import { FileType } from '@ying/shared'
import { FileEntity } from '@ying/shared/entities'
import { storageConfig } from '@/server/config'
import { EXPIR_SECONDS } from './constant'
import { AddFileOptions, UploadFileOptions, AbstractFileService } from './abstract.file.service'

export class MinioFileService implements AbstractFileService {
  private readonly storageConf: ConfigType<typeof storageConfig>

  private readonly dataSource: DataSource

  private readonly fileRepository: Repository<FileEntity>

  private minioClient: Client

  constructor(storageConf: ConfigType<typeof storageConfig>, dataSource: DataSource) {
    this.storageConf = storageConf
    this.dataSource = dataSource
    this.fileRepository = dataSource.getRepository(FileEntity)
    this.getMinioClient()
  }

  private async getMinioClient() {
    const minioClient = new Client({
      endPoint: this.storageConf.host,
      port: this.storageConf.port,
      useSSL: this.storageConf.port === 443,
      accessKey: this.storageConf.accessKey,
      secretKey: this.storageConf.secretKey
    })
    const bucketExists = await minioClient.bucketExists(this.storageConf.bucket)
    if (!bucketExists) {
      minioClient.makeBucket(this.storageConf.bucket)
    }

    this.minioClient = minioClient
  }

  async uploadFile({ file, fileType, from, userId, extra }: UploadFileOptions) {
    const fileName = nanoid()
    const objectName = `${fileType}/${fileName}`

    await this.minioClient.putObject(this.storageConf.bucket, objectName, file.buffer, null, {
      'Content-Type': file.mimetype,
      from,
      userId
    })
    const url = await this.getPresignedUrl(objectName)

    const fileEntity = this.fileRepository.create({
      type: fileType,
      path: objectName,
      url,
      from,
      userId,
      extra
    })
    await this.fileRepository.save(fileEntity)

    return fileEntity
  }

  async addFile({ url, fileType, from, userId }: AddFileOptions) {
    const fileEntity = this.fileRepository.create({
      type: fileType,
      path: url,
      url,
      from,
      userId
    })

    await this.fileRepository.save(fileEntity)

    return fileEntity
  }

  getPresignedUrl(objectName: string) {
    return this.minioClient.presignedUrl('get', this.storageConf.bucket, objectName, EXPIR_SECONDS)
  }

  async deleteFiles(files: FileEntity[]) {
    await this.dataSource.transaction(async t => {
      await t.delete(FileEntity, { id: In(files.map(el => el.id)) })

      await this.minioClient.removeObjects(
        this.storageConf.bucket,
        files.filter(el => el.type !== FileType.Url).map(el => el.path)
      )
    })
  }

  async deleteDriftFilesByExcludeIds(excludeIds: number[]) {
    const driftFiles = await this.fileRepository.find({
      where: { id: Not(In(excludeIds)) }
    })

    await this.deleteFiles(driftFiles)
  }
}
