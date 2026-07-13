import { APP_GUARD } from '@nestjs/core'
import { Module } from '@nestjs/common'
import { AdminAuthGuard, AdminPermissionGuard } from './sys/auth/guard'
import { SysModule } from './sys/sys.module'
import { CommonModule } from './common/common.module'
import { UserModule } from './user/user.module'
import { ArticleModule } from './article/article.module'
import { NotificationModule } from './notification/notification.module'

@Module({
  imports: [SysModule, CommonModule, UserModule, ArticleModule, NotificationModule],
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
