import { SettingDto } from '@ying/shared'
import { request } from './request'

export function clearPermissionCache() {
  return request.get('/sys/setting/clear-permission-cache')
}

export function clearDriftFile() {
  return request.get('/sys/setting/clear-drift-file')
}

export function getSetting(): Promise<SettingDto> {
  return request.get('/sys/setting')
}

export function updateSetting(dto: SettingDto) {
  return request.post('/sys/setting', dto)
}
