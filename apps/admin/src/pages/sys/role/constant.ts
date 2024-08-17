import { BasicStatus, CreateRoleDto } from '@ying/shared'

export const defultRoleValues: Partial<CreateRoleDto> = {
  name: '',
  status: BasicStatus.ENABLE,
  sort: undefined,
  remark: '',
  permissionCodes: []
}
