import { BasicStatus, UpdateSysUserDto } from '@ying/shared'

export const defultUserValues: Partial<UpdateSysUserDto> = {
  id: undefined,
  name: '',
  account: '',
  email: '',
  password: '',
  status: BasicStatus.ENABLE,
  roleIds: [],
  remark: undefined
}
