import { HttpRequest } from '@ying/http'
import { PushRecordEntity, PushTaskEntity, PushTemplateEntity, VisitorEntity } from '@ying/entity'
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
} from '@ying/dto'

import { timeDataTransform } from '../helpers'

export default function (http: HttpRequest) {
  return {
    createPushTemplate(data: CreatePushTemplateDto) {
      return http.post('/push-template', { data })
    },
    updatePushTemplate(data: UpdatePushTemplateDto) {
      return http.put('/push-template', { data })
    },
    getPushTemplate(id: number) {
      return http.get<PushTemplateEntity>(`/push-template/${id}`)
    },
    deletePushTemplate(id: number) {
      return http.delete(`/push-template/${id}`)
    },
    listPushTemplate(query: ListPushTemplateDto) {
      return http.get<PushTemplateEntity[]>('/push-template/list', { query: timeDataTransform(query, 'date') })
    },
    listPushTemplateCount(query: ListPushTemplateDto) {
      return http.get<number>('/push-template/list-count', { query: timeDataTransform(query, 'date') })
    },
    sendNotice(data: SendNotificationDto) {
      return http.post('/notice/send', { data })
    },
    createPushTask(data: CreatePushTaskDto) {
      return http.post('/push-task', { data })
    },
    updatePushTask(data: UpdatePushTaskDto) {
      return http.put('/push-task', { data })
    },
    getPushTask(id: number) {
      return http.get<PushTaskEntity>(`/push-task/${id}`)
    },
    deletePushTask(id: number) {
      return http.delete(`/push-task/${id}`)
    },
    listPushTask(query: ListPushTaskDto) {
      return http.get<PushTaskEntity[]>('/push-task/list', { query: timeDataTransform(query, 'date') })
    },
    listPushTaskCount(query: ListPushTaskDto) {
      return http.get<number>('/push-task/list-count', { query: timeDataTransform(query, 'date') })
    },
    setPushTask(data: SetPushTaskDto) {
      return http.post('/push-task/set', { data: timeDataTransform(data, 'time') })
    },
    stopTimingPushTask(id: number) {
      return http.get(`/push-task/${id}/stop-timing`)
    },
    listPushRecord(query: ListPushRecordDto) {
      return http.get<PushRecordEntity[]>('/push-record/list', { query: timeDataTransform(query, 'date') })
    },
    listPushRecordCount(query: ListPushRecordDto) {
      return http.get<number>('/push-record/list-count', { query: timeDataTransform(query, 'date') })
    },
    listVisitor(query: ListVisitorDto) {
      return http.get<VisitorEntity[]>('/visitor/list', { query: timeDataTransform(query, 'date') })
    },
    listVisitorCount(query: ListVisitorDto) {
      return http.get<number>('/visitor/list-count', { query: timeDataTransform(query, 'date') })
    },
    deleteVisitor(id: string) {
      return http.delete(`/visitor/${id}`)
    }
  }
}
