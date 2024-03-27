import { CreateOrUpdatePermissionDto } from '@shared'
import { request } from './request'
import { SysPermissionEntity } from '@shared/entities'

export async function list(): Promise<SysPermissionEntity[]> {
  return request.get('/sys/permission/list')
}

export function createOrUpdate(data: CreateOrUpdatePermissionDto) {
  return request.post('/sys/permission', data)
}

export function del(code: string) {
  return request.delete(`/sys/permission/${code}`)
}
