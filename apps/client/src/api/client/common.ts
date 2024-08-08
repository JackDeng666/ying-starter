import { CreateFeedbackDto, CreateVisitorDto, NoticeSubscribeDto } from '@ying/shared'
import { FileEntity, VisitorEntity } from '@ying/shared/entities'

import { BaseApi } from './request'

export class CommonApi extends BaseApi {
  checkLiveDebug(): Promise<boolean> {
    return this.request.get('/check-live-debug')
  }

  createFeedback(dto: CreateFeedbackDto) {
    return this.request.post('/feedback', dto)
  }

  upload(file: File): Promise<FileEntity> {
    const form = new FormData()
    form.append('file', file)
    return this.request.post('/file', form)
  }

  createVisitor(dto: CreateVisitorDto): Promise<VisitorEntity> {
    return this.request.post('/visitor', dto)
  }

  subscribe(dto: NoticeSubscribeDto) {
    return this.request.post('/visitor/subscribe', dto)
  }

  bindUser(id: string): Promise<VisitorEntity> {
    return this.request.get(`/visitor/${id}/bind`)
  }
}
