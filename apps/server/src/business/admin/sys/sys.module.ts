import { Module } from '@nestjs/common'
import { SysRoleModule } from './role/role.module'
import { SysUserModule } from './user/user.module'
import { SysAuthModule } from './auth/auth.module'
import { SysSettingModule } from './setting/setting.module'

@Module({
  imports: [SysRoleModule, SysUserModule, SysAuthModule, SysSettingModule],
  exports: [SysAuthModule]
})
export class SysModule {}
