import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FileEntity } from '@ying/shared/entities'
import { FileService } from './file.service'
import { FileSubscriber } from './file.subscriber'

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([FileEntity])],
  providers: [FileService, FileSubscriber],
  exports: [FileService]
})
export class StorageModule {}
