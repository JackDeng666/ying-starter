import { request } from './request'

export function clearPermissionCache() {
  return request.get('/sys/setting/clear-permission-cache')
}

export function clearDriftFile() {
  return request.get('/sys/setting/clear-drift-file')
}
