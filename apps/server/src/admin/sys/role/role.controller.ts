import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { SysRoleService } from './role.service'
import { CreateRoleDto, ListRoleDto, UpdateRoleDto } from '@ying/shared'
import { AdminScope, PermissionDecorator } from '@/common/decorator'
import { pms } from '@/common/permission'

@ApiTags('admin system role')
@Controller('role')
@AdminScope()
@PermissionDecorator(pms.sys.role)
export class SysRoleController {
  constructor(private readonly sysRoleService: SysRoleService) {}

  @ApiOperation({
    summary: 'get role list'
  })
  @Get('list')
  list(@Query() listRoleDto: ListRoleDto) {
    return this.sysRoleService.list(listRoleDto)
  }

  @ApiOperation({
    summary: 'get role list count'
  })
  @Get('list-count')
  listCount(@Query() listRoleDto: ListRoleDto) {
    return this.sysRoleService.listCount(listRoleDto)
  }

  @ApiOperation({
    summary: 'create role'
  })
  @PermissionDecorator(pms.sys.role.create)
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.sysRoleService.create(createRoleDto)
  }

  @ApiOperation({
    summary: 'update role'
  })
  @PermissionDecorator(pms.sys.role.update)
  @Put()
  update(@Body() updateRoleDto: UpdateRoleDto) {
    return this.sysRoleService.update(updateRoleDto)
  }

  @ApiOperation({
    summary: 'delete role'
  })
  @PermissionDecorator(pms.sys.role.delete)
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.sysRoleService.delete(id)
  }
}
