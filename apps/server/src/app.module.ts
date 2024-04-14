import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { apiConfig, redisConfig, dbConfig, minioConfig, authConfig, mailConfig } from '@/server/config'
import { RedisModule } from '@/server/modules/redis/redis.module'
import { DbModule } from '@/server/modules/db/db.module'
import { FileModule } from '@/server/modules/file/file.module'
import { MailModule } from '@/server/modules/mail/mail.module'
import { AdminModule } from '@/server/admin/admin.module'
import { ClientModule } from '@/server/client/client.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [apiConfig, redisConfig, dbConfig, minioConfig, authConfig, mailConfig],
      envFilePath: ['.env.local', '.env']
    }),
    RedisModule,
    DbModule,
    FileModule,
    MailModule,
    AdminModule,
    ClientModule
  ]
})
export class AppModule {}
