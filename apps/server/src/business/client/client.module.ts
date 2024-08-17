import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'

import { AuthModule } from './auth/auth.module'
import { CommonModule } from './common/common.module'
import { ArticleModule } from './article/article.module'

import { ClientAuthGuard } from './auth/strategy/client.auth.guard'

@Module({
  imports: [AuthModule, CommonModule, ArticleModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ClientAuthGuard
    }
  ]
})
export class ClientModule {}
