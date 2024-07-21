import { Body, Controller, Get, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { pms } from '@ying/shared/permission'
import { AdminScope, PermissionDecorator } from '@/server/common/decorator'
import { SysSettingService } from './setting.service'
import { SettingDto } from '@ying/shared'

@ApiTags('admin system setting')
@Controller('setting')
@AdminScope()
@PermissionDecorator(pms.sys.setting)
export class SysSettingController {
  constructor(private readonly sysSettingService: SysSettingService) {}

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
    summary: 'get setting'
  })
  @Get()
  getSetting() {
    return this.sysSettingService.getSetting()
  }

  @ApiOperation({
    summary: 'update setting'
  })
  @PermissionDecorator(pms.sys.setting.updateSetting)
  @Post()
  updateSetting(@Body() settingDto: SettingDto) {
    return this.sysSettingService.updateSetting(settingDto)
  }
}
