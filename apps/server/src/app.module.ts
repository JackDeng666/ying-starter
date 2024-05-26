import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { apiConfig, redisConfig, dbConfig, storageConfig, authConfig, mailConfig } from '@/server/config'
import { RedisModule } from '@/server/modules/redis/redis.module'
import { DbModule } from '@/server/modules/db/db.module'
import { StorageModule } from '@/server/modules/storage/storage.module'
import { MailModule } from '@/server/modules/mail/mail.module'
import { AdminModule } from '@/server/admin/admin.module'
import { ClientModule } from '@/server/client/client.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [apiConfig, redisConfig, dbConfig, authConfig, mailConfig, storageConfig],
      envFilePath: ['.env.local', '.env']
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
