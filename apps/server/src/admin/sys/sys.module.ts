import { Module } from '@nestjs/common'
import { RouterModule } from '@nestjs/core'
import { SysRoleModule } from './role/role.module'
import { SysUserModule } from './user/user.module'
import { SysAuthModule } from './auth/auth.module'
import { SysSettingModule } from './setting/setting.module'

@Module({
  imports: [
    SysRoleModule,
    SysUserModule,
    SysAuthModule,
    SysSettingModule,
    RouterModule.register([
      {
        path: 'admin/sys',
        children: [
          {
            path: '/',
            module: SysRoleModule
          },
          {
            path: '/',
            module: SysUserModule
          },
          {
            path: '/',
            module: SysAuthModule
          },
          {
            path: '/',
            module: SysSettingModule
          }
        ]
      }
    ])
  ],
  exports: [SysAuthModule]
})
export class SysModule {}
