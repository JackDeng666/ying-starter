import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { AcceptLanguageResolver, HeaderResolver, I18nModule } from 'nestjs-i18n'
import { join } from 'path'

import { apiConfig, redisConfig, dbConfig, storageConfig, authConfig, mailConfig } from '@/server/config'
import { RedisModule } from '@/server/common/modules/redis/redis.module'
import { DbModule } from '@/server/common/modules/db/db.module'
import { StorageModule } from '@/server/common/modules/storage/storage.module'
import { MailModule } from '@/server/common/modules/mail/mail.module'
import { AdminModule } from '@/server/business/admin/admin.module'
import { ClientModule } from '@/server/business/client/client.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [apiConfig, redisConfig, dbConfig, authConfig, mailConfig, storageConfig],
      envFilePath: ['.env.local', '.env']
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: join(__dirname, './i18n/'),
        watch: true
      },
      resolvers: [new HeaderResolver(['lng']), AcceptLanguageResolver]
    }),
    ScheduleModule.forRoot(),
    RedisModule,
    DbModule,
    StorageModule,
    MailModule,
    AdminModule,
    ClientModule
  ]
})
export class AppModule {}
