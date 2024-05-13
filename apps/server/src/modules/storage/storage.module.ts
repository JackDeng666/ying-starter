import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Client } from 'minio'
import { ConfigType } from '@nestjs/config'
import { storageConfig } from '@/server/config'
import { FileEntity } from '@ying/shared/entities'
import { FileService } from './file.service'
import { MINIO_TOKEN } from './constant'
import { FileSubscriber } from './file.subscriber'

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([FileEntity])],
  providers: [
    {
      provide: MINIO_TOKEN,
      async useFactory(storageConf: ConfigType<typeof storageConfig>) {
        const minioClient = new Client({
          endPoint: storageConf.host,
          port: storageConf.port,
          useSSL: storageConf.port === 443,
          accessKey: storageConf.accessKey,
          secretKey: storageConf.secretKey
        })
        const bucketExists = await minioClient.bucketExists(storageConf.bucket)
        if (!bucketExists) {
          minioClient.makeBucket(storageConf.bucket)
        }
        return minioClient
      },
      inject: [storageConfig.KEY]
    },
    FileService,
    FileSubscriber
  ],
  exports: [FileService]
})
export class StorageModule {}
