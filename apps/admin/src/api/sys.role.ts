import { CreateRoleDto, ListRoleDto, UpdateRoleDto } from '@ying/shared'
import { request } from './request'
import { SysRoleEntity } from '@ying/shared/entities'

export function list(data: ListRoleDto): Promise<SysRoleEntity[]> {
  return request.get('/sys/role/list', { params: data })
}

export function listCount(data: ListRoleDto): Promise<number> {
  return request.get('/sys/role/list-count', { params: data })
}

export function create(data: CreateRoleDto) {
  return request.post('/sys/role', data)
}

export function update(data: UpdateRoleDto) {
  return request.put('/sys/role', data)
}

export function del(id: number) {
  return request.delete(`/sys/role/${id}`)
}
