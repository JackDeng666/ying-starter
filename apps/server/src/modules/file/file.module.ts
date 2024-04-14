import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Client } from 'minio'
import { ConfigType } from '@nestjs/config'
import { minioConfig } from '@/server/config'
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
      async useFactory(minioConf: ConfigType<typeof minioConfig>) {
        const minioClient = new Client({
          endPoint: minioConf.host,
          port: minioConf.port,
          accessKey: minioConf.accessKey,
          secretKey: minioConf.secretKey
        })
        const bucketExists = await minioClient.bucketExists(minioConf.bucket)
        if (!bucketExists) {
          minioClient.makeBucket(minioConf.bucket)
        }
        return minioClient
      },
      inject: [minioConfig.KEY]
    },
    FileService,
    FileSubscriber
  ],
  exports: [FileService]
})
export class FileModule {}
