import { Module } from '@nestjs/common'
import { UserModule as BaseUserModule } from '@/business/modules/user'
import { UserController } from './user.controller'
import { UserStatController } from './user.stat.controller'

@Module({
  imports: [BaseUserModule],
  controllers: [UserController, UserStatController]
})
export class UserModule {}
