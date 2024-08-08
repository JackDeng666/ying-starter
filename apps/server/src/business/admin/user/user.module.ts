import { Module } from '@nestjs/common'
import { UserModule as BaseUserModule } from '@/server/business/modules/user/user.module'
import { AdminUserController } from './user.controller'
import { UserStatController } from './user.stat.controller'

@Module({
  imports: [BaseUserModule],
  controllers: [AdminUserController, UserStatController]
})
export class UserModule {}
