import { APP_GUARD } from '@nestjs/core'
import { Module } from '@nestjs/common'
import { AdminAuthGuard, AdminPermissionGuard } from '@/server/business/admin/sys/auth/guard'
import { SysModule } from './sys/sys.module'
import { UserModule } from './user/user.module'
import { CommonModule } from './common/common.module'

@Module({
  imports: [SysModule, UserModule, CommonModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AdminAuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: AdminPermissionGuard
    }
  ]
})
export class AdminModule {}
