import { ConfigVo, ListFeedbackDto, ListFileDto } from '@ying/shared'
import { FeedbackEntity, FileEntity, TFileExtra } from '@ying/shared/entities'

import { request, timeDataTransform } from './request'

export function getConfig(): Promise<ConfigVo> {
  return request.get('/config')
}

export function uploadImage(file: File, extra?: TFileExtra): Promise<FileEntity> {
  const form = new FormData()
  form.append('file', file)
  form.append('extra', JSON.stringify(extra))
  return request.post('/file/image', form)
}

export function listFile(params: ListFileDto): Promise<FileEntity[]> {
  return request.get('/file/list', { params: timeDataTransform(params, 'date') })
}

export function listFileCount(params: ListFileDto): Promise<number> {
  return request.get('/file/list-count', { params: timeDataTransform(params, 'date') })
}

export function deleteFile(id: number) {
  return request.delete(`/file/${id}`)
}

export function listFeedback(params: ListFeedbackDto): Promise<FeedbackEntity[]> {
  return request.get('/feedback/list', { params: timeDataTransform(params, 'date') })
}

export function listFeedbackCount(params: ListFeedbackDto): Promise<number> {
  return request.get('/feedback/list-count', { params: timeDataTransform(params, 'date') })
}

export function deleteFeedback(id: number) {
  return request.delete(`/feedback/${id}`)
}
