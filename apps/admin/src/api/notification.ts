import { PushRecordEntity, PushTaskEntity, PushTemplateEntity, VisitorEntity } from '@ying/shared/entities'
import {
  CreatePushTemplateDto,
  UpdatePushTemplateDto,
  ListPushTemplateDto,
  SendNotificationDto,
  CreatePushTaskDto,
  UpdatePushTaskDto,
  ListPushTaskDto,
  SetPushTaskDto,
  ListPushRecordDto,
  ListVisitorDto
} from '@ying/shared'

import { request, timeDataTransform } from './request'

export function createPushTemplate(data: CreatePushTemplateDto) {
  return request.post('/push-template', data)
}

export function updatePushTemplate(data: UpdatePushTemplateDto) {
  return request.put('/push-template', data)
}

export function getPushTemplate(id: number): Promise<PushTemplateEntity> {
  return request.get(`/push-template/${id}`)
}

export function deletePushTemplate(id: number) {
  return request.delete(`/push-template/${id}`)
}

export function listPushTemplate(params: ListPushTemplateDto): Promise<PushTemplateEntity[]> {
  return request.get('/push-template/list', { params: timeDataTransform(params, 'date') })
}

export function listPushTemplateCount(params: ListPushTemplateDto): Promise<number> {
  return request.get('/push-template/list-count', { params: timeDataTransform(params, 'date') })
}

export function sendNotice(data: SendNotificationDto) {
  return request.post('/notice/send', data)
}

export function createPushTask(data: CreatePushTaskDto) {
  return request.post('/push-task', data)
}

export function updatePushTask(data: UpdatePushTaskDto) {
  return request.put('/push-task', data)
}

export function getPushTask(id: number): Promise<PushTaskEntity> {
  return request.get(`/push-task/${id}`)
}

export function deletePushTask(id: number) {
  return request.delete(`/push-task/${id}`)
}

export function listPushTask(params: ListPushTaskDto): Promise<PushTaskEntity[]> {
  return request.get('/push-task/list', { params: timeDataTransform(params, 'date') })
}

export function listPushTaskCount(params: ListPushTaskDto): Promise<number> {
  return request.get('/push-task/list-count', { params: timeDataTransform(params, 'date') })
}

export function setPushTask(data: SetPushTaskDto) {
  return request.post('/push-task/set', timeDataTransform(data, 'time'))
}

export function stopTimingPushTask(id: number) {
  return request.get(`/push-task/${id}/stop-timing`)
}

export function listPushRecord(params: ListPushRecordDto): Promise<PushRecordEntity[]> {
  return request.get('/push-record/list', { params: timeDataTransform(params, 'date') })
}

export function listPushRecordCount(params: ListPushRecordDto): Promise<number> {
  return request.get('/push-record/list-count', { params: timeDataTransform(params, 'date') })
}

export function listVisitor(params: ListVisitorDto): Promise<VisitorEntity[]> {
  return request.get('/visitor/list', { params: timeDataTransform(params, 'date') })
}

export function listVisitorCount(params: ListVisitorDto): Promise<number> {
  return request.get('/visitor/list-count', { params: timeDataTransform(params, 'date') })
}
