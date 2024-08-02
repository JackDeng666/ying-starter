import { FileSourceType, FileType } from '@ying/shared'
import { FileEntity } from '@ying/shared/entities'

export type UploadFileOptions = {
  file: MulterFile
  fileType: FileType
  from: FileSourceType
  userId: number
}

export type AddFileOptions = {
  url: string
  fileType: FileType
  from: FileSourceType
  userId: number
}

export abstract class AbstractFileService {
  abstract uploadFile(options: UploadFileOptions): Promise<FileEntity> | FileEntity

  abstract addFile(options: AddFileOptions): Promise<FileEntity> | FileEntity

  abstract getPresignedUrl(path: string): Promise<string> | string

  abstract deleteFiles(files: FileEntity[]): void

  abstract deleteDriftFilesByExcludeIds(excludeIds: number[]): Promise<void>
}
