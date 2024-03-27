import { Controller, Get, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ListUserDto } from '@/shared'
import { UserService } from './user.service'
import { AdminScope } from '@/common/decorator'

@ApiTags('admin user')
@Controller('admin/user')
@AdminScope()
export class UserController {
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
