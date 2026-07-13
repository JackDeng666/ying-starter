import { Module } from '@nestjs/common'
import { WSGateway } from './ws.gateway'

import { SysAuthModule } from '../admin/sys/auth/auth.module'

@Module({
  imports: [SysAuthModule],
  providers: [WSGateway],
  exports: [WSGateway]
})
export class WSModule {}
