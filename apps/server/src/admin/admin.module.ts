import { APP_GUARD } from '@nestjs/core'
import { Module } from '@nestjs/common'
import { AdminAuthGuard, AdminPermissionGuard } from '@/admin/sys/auth/guard'
import { AdminFileController } from './file.controller'
import { SysModule } from './sys/sys.module'
import { UserModule } from './user/user.module'

@Module({
  imports: [SysModule, UserModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AdminAuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: AdminPermissionGuard
    }
  ],
  controllers: [AdminFileController]
})
export class AdminModule {}
