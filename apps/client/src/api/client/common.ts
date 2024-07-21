import { CreateFeedbackDto } from '@ying/shared'
import { FileEntity } from '@ying/shared/entities'

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
}
