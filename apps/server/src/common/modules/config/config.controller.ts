import { Controller, Get } from '@nestjs/common'
import { Public } from '@/server/common/decorator'
import { ConfigService } from './config.service'

@Public()
@Controller()
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get('admin/config')
  getAdminConfig() {
    return this.configService.getConfig()
  }

  @Get('client/config')
  getClientConfig() {
    return this.configService.getConfig()
  }
}
