import { Module } from '@nestjs/common'
import { APP_GUARD, RouterModule } from '@nestjs/core'
import { ClientAuthGuard } from './auth/strategy/client.auth.guard'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { FileController } from './file.controller'

@Module({
  imports: [
    UserModule,
    AuthModule,
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
          }
        ]
      }
    ])
  ],
  controllers: [FileController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ClientAuthGuard
    }
  ]
})
export class ClientModule {}
