import { FileEntity } from '@shared/entities'
import { request } from './request'

export function upload(file: File): Promise<FileEntity> {
  const form = new FormData()
  form.append('file', file)
  return request.post('/file', form)
}
