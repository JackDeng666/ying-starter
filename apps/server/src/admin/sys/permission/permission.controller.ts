import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { SysPermissionService } from './permission.service'
import { CreateOrUpdatePermissionDto } from '@ying/shared'
import { AdminScope } from '@/server/common/decorator'
import { PermissionDecorator } from '@/server/common/decorator'
import { pms } from '@/server/common/permission'

@ApiTags('admin system permission')
@Controller('permission')
@AdminScope()
@PermissionDecorator(pms.sys.permission)
export class SysPermissionController {
  constructor(private readonly sysPermissionService: SysPermissionService) {}

  @ApiOperation({
    summary: 'get permission list'
  })
  @Get('list')
  list() {
    return this.sysPermissionService.list()
  }

  @ApiOperation({
    summary: 'create or update permission'
  })
  @PermissionDecorator(pms.sys.permission.createOrUpdate)
  @Post()
  update(@Body() dto: CreateOrUpdatePermissionDto) {
    return this.sysPermissionService.createOrUpdate(dto)
  }

  @ApiOperation({
    summary: 'delete permission'
  })
  @PermissionDecorator(pms.sys.permission.delete)
  @Delete(':code')
  delete(@Param('code') code: string) {
    return this.sysPermissionService.delete(code)
  }
}
