import { BasicStatus } from '@ying/shared'
import type { CreateRoleDto } from '@ying/dto'

export const defaultRoleValues: Partial<CreateRoleDto> = {
  name: '',
  status: BasicStatus.ENABLE,
  sort: undefined,
  remark: '',
  permissionCodes: []
}
