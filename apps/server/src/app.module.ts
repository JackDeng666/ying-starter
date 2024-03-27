import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { apiConfig, redisConfig, dbConfig, minioConfig, authConfig, mailConfig } from '@/config'
import { RedisModule } from '@/modules/redis/redis.module'
import { DbModule } from '@/modules/db/db.module'
import { FileModule } from '@/modules/file/file.module'
import { MailModule } from '@/modules/mail/mail.module'
import { AdminModule } from '@/admin/admin.module'
import { ClientModule } from '@/client/client.module'

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
