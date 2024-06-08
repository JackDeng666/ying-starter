import { ListFileDto } from '@ying/shared'
import { FileEntity } from '@ying/shared/entities'
import { request } from './request'

export function upload(file: File): Promise<FileEntity> {
  const form = new FormData()
  form.append('file', file)
  return request.post('/file', form)
}

export function list(params: ListFileDto): Promise<FileEntity[]> {
  return request.get('/file/list', { params })
}

export function listCount(params: ListFileDto): Promise<number> {
  return request.get('/file/list-count', { params })
}
