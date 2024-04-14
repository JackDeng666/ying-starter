import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Not, Repository } from 'typeorm'
import { Client } from 'minio'
import { nanoid } from 'nanoid'
import { FileSourceType, FileType } from '@ying/shared'
import { FileEntity } from '@ying/shared/entities'
import { EXPIR_SECONDS, MINIO_TOKEN } from './constant'
import { minioConfig } from '@/server/config'
import { ConfigType } from '@nestjs/config'

type UploadFileOptions = {
  file: MulterFile
  fileType: FileType
  from: FileSourceType
  userId: number
}

type AddFileOptions = {
  url: string
  fileType: FileType
  from: FileSourceType
  userId: number
}

@Injectable()
export class FileService {
  @Inject(MINIO_TOKEN)
  private readonly minioClient: Client

  @InjectRepository(FileEntity)
  private readonly minioFileRepository: Repository<FileEntity>

  @Inject(minioConfig.KEY)
  private readonly minioCof: ConfigType<typeof minioConfig>

  async uploadFile({ file, fileType, from, userId }: UploadFileOptions) {
    const fileName = nanoid()
    const objectName = `${fileType}/${fileName}`

    await this.minioClient.putObject(this.minioCof.bucket, objectName, file.buffer, {
      'Content-Type': file.mimetype,
      from,
      userId
    })
    const url = await this.getPresignedUrl(objectName)

    const minioFile = this.minioFileRepository.create({
      type: fileType,
      path: objectName,
      url,
      from,
      userId
    })
    await this.minioFileRepository.save(minioFile)

    return minioFile
  }

  async addFile({ url, fileType, from, userId }: AddFileOptions) {
    const minioFile = this.minioFileRepository.create({
      type: fileType,
      path: url,
      url,
      from,
      userId
    })

    await this.minioFileRepository.save(minioFile)

    return minioFile
  }

  getPresignedUrl(objectName: string) {
    return this.minioClient.presignedUrl('get', this.minioCof.bucket, objectName, EXPIR_SECONDS)
  }

  async deleteFiles(files: FileEntity[]) {
    await this.minioFileRepository.delete({ id: In(files.map(el => el.id)) })

    await this.minioClient.removeObjects(
      this.minioCof.bucket,
      files.filter(el => el.type !== FileType.Url).map(el => el.path)
    )
  }

  async deleteDriftFilesByExcludeIds(excludeIds: number[]) {
    const driftFiles = await this.minioFileRepository.find({
      where: { id: Not(In(excludeIds)) }
    })

    await this.deleteFiles(driftFiles)
  }
}
