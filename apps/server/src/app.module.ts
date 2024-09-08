import { Module } from '@nestjs/common'
import { ConfigModule as BaseConfigModule, ConfigType } from '@nestjs/config'
import { BullModule } from '@nestjs/bull'
import { ScheduleModule } from '@nestjs/schedule'
import { AcceptLanguageResolver, HeaderResolver, I18nModule } from 'nestjs-i18n'
import { join } from 'path'

import { clientLanguagesConfig } from '@ying/shared'

import { apiConfig, redisConfig, dbConfig, storageConfig, authConfig, mailConfig, pushConfig } from '@/server/config'
import { RedisModule } from '@/server/common/modules/redis/redis.module'
import { DbModule } from '@/server/common/modules/db/db.module'
import { StorageModule } from '@/server/common/modules/storage/storage.module'
import { MailModule } from '@/server/common/modules/mail/mail.module'
import { PushModule } from '@/server/common/modules/push/push.module'
import { ConfigModule } from '@/server/common/modules/config/config.module'
import { AdminModule } from '@/server/business/admin/admin.module'
import { ClientModule } from '@/server/business/client/client.module'

@Module({
  imports: [
    BaseConfigModule.forRoot({
      isGlobal: true,
      load: [apiConfig, redisConfig, dbConfig, authConfig, mailConfig, storageConfig, pushConfig],
      envFilePath: ['.env.local', '.env']
    }),
    I18nModule.forRoot({
      fallbackLanguage: clientLanguagesConfig.fallbackLng,
      loaderOptions: {
        path: join(__dirname, './i18n/'),
        watch: true
      },
      resolvers: [new HeaderResolver(['lng']), AcceptLanguageResolver]
    }),
    ScheduleModule.forRoot(),
    RedisModule,
    BullModule.forRootAsync({
      useFactory: (redisConf: ConfigType<typeof redisConfig>) => {
        return {
          redis: {
            host: redisConf.host,
            port: redisConf.port,
            password: redisConf.pass,
            db: 1
          }
        }
      },
      inject: [redisConfig.KEY]
    }),
    DbModule,
    StorageModule,
    MailModule,
    PushModule,
    ConfigModule,
    AdminModule,
    ClientModule
  ]
})
export class AppModule {}
