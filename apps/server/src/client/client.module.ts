import { Module } from '@nestjs/common'
import { APP_GUARD, RouterModule } from '@nestjs/core'
import { ClientAuthGuard } from './auth/strategy/client.auth.guard'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { CommonModule } from './common/common.module'

@Module({
  imports: [
    UserModule,
    AuthModule,
    CommonModule,
    RouterModule.register([
      {
        path: 'client',
        children: [
          {
            path: '/',
            module: UserModule
          },
          {
            path: '/',
            module: AuthModule
          },
          {
            path: '/',
            module: CommonModule
          }
        ]
      }
    ])
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ClientAuthGuard
    }
  ]
})
export class ClientModule {}
