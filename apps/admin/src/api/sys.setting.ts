import { ConfigDto } from '@ying/shared'
import { request } from './request'

export function clearPermissionCache() {
  return request.get('/sys/setting/clear-permission-cache')
}

export function clearDriftFile() {
  return request.get('/sys/setting/clear-drift-file')
}

export function updateSetting(dto: ConfigDto) {
  return request.post('/sys/setting', dto)
}
