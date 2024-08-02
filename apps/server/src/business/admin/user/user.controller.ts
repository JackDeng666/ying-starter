import { Controller, Get, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ListUserDto } from '@ying/shared'
import { pms } from '@ying/shared/permission'
import { AdminScope, PermissionDecorator } from '@/server/common/decorator'
import { UserService } from '@/server/business/modules/user/user.service'

@ApiTags('admin user')
@Controller('admin/user')
@AdminScope()
@PermissionDecorator(pms.user)
export class AdminUserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'get user list'
  })
  @Get('list')
  list(@Query() listUserDto: ListUserDto) {
    return this.userService.list(listUserDto)
  }

  @ApiOperation({
    summary: 'get user list count'
  })
  @Get('list-count')
  listCount(@Query() listUserDto: ListUserDto) {
    return this.userService.listCount(listUserDto)
  }
}
