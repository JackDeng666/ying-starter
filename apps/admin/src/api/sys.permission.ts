import { CreateOrUpdatePermissionDto } from '@ying/shared'
import { request } from './request'
import { SysPermissionEntity } from '@ying/shared/entities'

export async function list(): Promise<SysPermissionEntity[]> {
  return request.get('/sys/permission/list')
}

export function createOrUpdate(data: CreateOrUpdatePermissionDto) {
  return request.post('/sys/permission', data)
}

export function del(code: string) {
  return request.delete(`/sys/permission/${code}`)
}
