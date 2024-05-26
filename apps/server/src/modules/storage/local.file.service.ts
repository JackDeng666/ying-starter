import { dirname, join } from 'path'
import { writeFileSync, unlink, existsSync, mkdirSync, PathLike } from 'fs'
import { ConfigType } from '@nestjs/config'
import { In, Not, Repository } from 'typeorm'
import { nanoid } from 'nanoid'
import { FileEntity } from '@ying/shared/entities'
import { storageConfig } from '@/server/config'
import { AddFileOptions, UploadFileOptions, AbstractFileService } from './abstract.file.service'

export class LocalFileService implements AbstractFileService {
  private readonly storageConf: ConfigType<typeof storageConfig>

  private readonly fileRepository: Repository<FileEntity>

  constructor(storageConf: ConfigType<typeof storageConfig>, fileRepository: Repository<FileEntity>) {
    this.storageConf = storageConf
    this.fileRepository = fileRepository
  }

  async uploadFile({ file, fileType, from, userId }: UploadFileOptions) {
    const ext = this.getFileExt(file.originalname)
    const fileName = nanoid()
    const objectName = `${fileType}/${fileName}.${ext}`

    const filePath = join(__dirname, `../../../upload/${objectName}`)

    this.checkDirExistAndCreate(filePath)
    writeFileSync(filePath, file.buffer)

    const url = this.getPresignedUrl(objectName)

    const fileEnitity = this.fileRepository.create({
      type: fileType,
      path: objectName,
      url,
      from,
      userId
    })
    await this.fileRepository.save(fileEnitity)

    return fileEnitity
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
    return this.storageConf.serverUrl + '/upload/' + objectName
  }

  async deleteFiles(files: FileEntity[]) {
    await Promise.all(files.map(el => this.deleteFile(join(__dirname, `../../../upload/${el.path}`))))

    await this.fileRepository.delete({ id: In(files.map(el => el.id)) })
  }

  deleteFile(path: PathLike) {
    return new Promise(re => {
      unlink(path, re)
    })
  }

  async deleteDriftFilesByExcludeIds(excludeIds: number[]) {
    const driftFiles = await this.fileRepository.find({
      where: { id: Not(In(excludeIds)) }
    })

    await this.deleteFiles(driftFiles)
  }

  checkDirExistAndCreate(filePath: string) {
    const dir = dirname(filePath)
    if (!existsSync(dir)) {
      this.checkDirExistAndCreate(dir)
      mkdirSync(dir)
    }
  }

  getFileExt(name: string) {
    const ext = name.split('.')
    return ext[ext.length - 1]
  }
}
