import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'

import {
  CreateSysUserDto,
  ListSysUserDto,
  UpdateSysUserDto,
  UpdateSysUserPasswordDto,
  UpdateSysUserSelfPasswordDto,
  UpdateSysUserSelfUserInfoDto
} from '@ying/dto'
import { pms } from '@ying/permission'
import { AdminScope, PermissionDecorator, UID } from '@/common/decorator'
import { SysUserService } from './user.service'

@Controller('admin/sys/user')
@AdminScope()
@PermissionDecorator(pms.sys.user)
export class SysUserController {
  constructor(private readonly sysUserService: SysUserService) {}

  @Get('list')
  list(@Query() dto: ListSysUserDto) {
    return this.sysUserService.list(dto)
  }

  @Get('list-count')
  listCount(@Query() dto: ListSysUserDto) {
    return this.sysUserService.listCount(dto)
  }

  @PermissionDecorator(pms.sys.user.create)
  @Post()
  create(@Body() dto: CreateSysUserDto) {
    return this.sysUserService.create(dto)
  }

  @PermissionDecorator(pms.sys.user.update)
  @Put()
  update(@Body() dto: UpdateSysUserDto) {
    return this.sysUserService.update(dto)
  }

  @PermissionDecorator(pms.sys.user.delete)
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.sysUserService.delete([id])
  }

  @PermissionDecorator(pms.sys.user.update)
  @Put('password')
  updatePassword(@Body() dto: UpdateSysUserPasswordDto) {
    return this.sysUserService.updatePassword(dto)
  }

  @Put('self-info')
  updateSelfInfo(@Body() dto: UpdateSysUserSelfUserInfoDto, @UID() uid: number) {
    return this.sysUserService.updateSelfInfo(dto, uid)
  }

  @Put('self-password')
  updateSelfPassword(@Body() dto: UpdateSysUserSelfPasswordDto, @UID() uid: number) {
    return this.sysUserService.updateSelfPassword(dto, uid)
  }
}
