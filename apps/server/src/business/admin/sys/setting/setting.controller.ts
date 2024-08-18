import { Body, Controller, Get, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ConfigDto } from '@ying/shared'
import { pms } from '@ying/shared/permission'
import { AdminScope, PermissionDecorator } from '@/server/common/decorator'
import { ConfigService } from '@/server/common/modules/config/config.service'
import { SysSettingService } from './setting.service'

@ApiTags('admin system setting')
@Controller('admin/sys/setting')
@AdminScope()
@PermissionDecorator(pms.sys.setting)
export class SysSettingController {
  constructor(
    private readonly sysSettingService: SysSettingService,
    private readonly configService: ConfigService
  ) {}

  @ApiOperation({
    summary: 'clear permission cache'
  })
  @PermissionDecorator(pms.sys.setting.clearPermissionCache)
  @Get('clear-permission-cache')
  clearPermissionCache() {
    return this.sysSettingService.clearPermissionCache()
  }

  @ApiOperation({
    summary: 'clear drift file'
  })
  @PermissionDecorator(pms.sys.setting.clearDriftFile)
  @Get('clear-drift-file')
  clearDriftFile() {
    return this.sysSettingService.clearDriftFile()
  }

  @ApiOperation({
    summary: 'update setting'
  })
  @PermissionDecorator(pms.sys.setting.updateSetting)
  @Post()
  updateSetting(@Body() dto: ConfigDto) {
    return this.configService.setConfig(dto)
  }
}
