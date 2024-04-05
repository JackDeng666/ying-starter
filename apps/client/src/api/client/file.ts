import { FileEntity } from '@shared/entities'
import { BaseApi } from './request'

export class FileApi extends BaseApi {
  upload(file: File): Promise<FileEntity> {
    const form = new FormData()
    form.append('file', file)
    return this.request.post('/file', form)
  }
}
