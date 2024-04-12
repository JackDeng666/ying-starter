import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { SysUserService } from './user.service'
import {
  CreateSysUserDto,
  ListSysUserDto,
  UpdateSysUserDto,
  UpdateSysUserPasswordDto,
  UpdateSysUserSelfPasswordDto,
  UpdateSysUserSelfUserInfoDto
} from '@ying/shared'
import { AdminScope, PermissionDecorator, UID } from '@/common/decorator'
import { pms } from '@/common/permission'

@ApiTags('admin system user')
@Controller('user')
@AdminScope()
@PermissionDecorator(pms.sys.user)
export class SysUserController {
  constructor(private readonly sysUserService: SysUserService) {}

  @ApiOperation({
    summary: 'get user list'
  })
  @Get('list')
  list(@Query() dto: ListSysUserDto) {
    return this.sysUserService.list(dto)
  }

  @ApiOperation({
    summary: 'get user list count'
  })
  @Get('list-count')
  listCount(@Query() dto: ListSysUserDto) {
    return this.sysUserService.listCount(dto)
  }

  @ApiOperation({
    summary: 'create user'
  })
  @PermissionDecorator(pms.sys.user.create)
  @Post()
  create(@Body() dto: CreateSysUserDto) {
    return this.sysUserService.create(dto)
  }

  @ApiOperation({
    summary: 'update user'
  })
  @PermissionDecorator(pms.sys.user.update)
  @Put()
  update(@Body() dto: UpdateSysUserDto) {
    return this.sysUserService.update(dto)
  }

  @ApiOperation({
    summary: 'delete user'
  })
  @PermissionDecorator(pms.sys.user.delete)
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.sysUserService.delete(id)
  }

  @ApiOperation({
    summary: 'update user password'
  })
  @PermissionDecorator(pms.sys.user.update)
  @Put('password')
  updatePassword(@Body() dto: UpdateSysUserPasswordDto) {
    return this.sysUserService.updatePassword(dto)
  }

  @ApiOperation({
    summary: 'update user self info'
  })
  @Put('self-info')
  updateSelfInfo(@Body() dto: UpdateSysUserSelfUserInfoDto, @UID() uid: number) {
    return this.sysUserService.updateSelfInfo(dto, uid)
  }

  @ApiOperation({
    summary: 'update user self password'
  })
  @Put('self-password')
  updateSelfPassword(@Body() dto: UpdateSysUserSelfPasswordDto, @UID() uid: number) {
    return this.sysUserService.updateSelfPassword(dto, uid)
  }
}
