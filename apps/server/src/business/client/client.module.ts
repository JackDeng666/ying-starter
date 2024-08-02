import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { UserModule } from '@/server/business/modules/user/user.module'
import { FeedbackModule } from '@/server/business/modules/feedback/feedback.module'
import { AuthModule } from './auth/auth.module'
import { UserController } from './user.controller'
import { CommonController } from './common.controller'
import { ClientAuthGuard } from './auth/strategy/client.auth.guard'

@Module({
  imports: [UserModule, FeedbackModule, AuthModule],
  controllers: [UserController, CommonController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ClientAuthGuard
    }
  ]
})
export class ClientModule {}
