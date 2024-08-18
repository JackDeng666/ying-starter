import { dirname, join } from 'path'
import { writeFileSync, unlink, existsSync, mkdirSync, PathLike } from 'fs'
import { DataSource, In, Not, Repository } from 'typeorm'
import { nanoid } from 'nanoid'
import { FileEntity } from '@ying/shared/entities'
import { AddFileOptions, UploadFileOptions, AbstractFileService } from './abstract.file.service'

export class LocalFileService implements AbstractFileService {
  private readonly dataSource: DataSource

  private readonly serverUrl: string

  private readonly fileRepository: Repository<FileEntity>

  constructor(dataSource: DataSource, serverUrl: string) {
    this.dataSource = dataSource
    this.serverUrl = serverUrl
    this.fileRepository = dataSource.getRepository(FileEntity)
  }

  async uploadFile({ file, fileType, from, userId, extra }: UploadFileOptions) {
    const ext = this.getFileExt(file.originalname)
    const fileName = nanoid()
    const objectName = `${fileType}/${fileName}.${ext}`

    const filePath = join(__dirname, `../../../uploadfiles/${objectName}`)

    this.checkDirExistAndCreate(filePath)
    writeFileSync(filePath, file.buffer)

    const url = this.getPresignedUrl(objectName)

    const fileEnitity = this.fileRepository.create({
      type: fileType,
      path: objectName,
      url,
      from,
      userId,
      extra
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
    return this.serverUrl + '/upload/' + objectName
  }

  async deleteFiles(files: FileEntity[]) {
    await this.dataSource.transaction(async t => {
      await t.delete(FileEntity, { id: In(files.map(el => el.id)) })
      await Promise.all(files.map(el => this.deleteFile(join(__dirname, `../../../uploadfiles/${el.path}`))))
    })
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
