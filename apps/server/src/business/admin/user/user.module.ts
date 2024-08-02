import { Module } from '@nestjs/common'
import { UserModule as BaseUserModule } from '@/server/business/modules/user/user.module'
import { AdminUserController } from './user.controller'

@Module({
  imports: [BaseUserModule],
  controllers: [AdminUserController]
})
export class UserModule {}
