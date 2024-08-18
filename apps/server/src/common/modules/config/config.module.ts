import { Global, Module } from '@nestjs/common'

import { ConfigController } from './config.controller'
import { ConfigService } from './config.service'

@Global()
@Module({
  controllers: [ConfigController],
  providers: [ConfigService],
  exports: [ConfigService]
})
export class ConfigModule {}
