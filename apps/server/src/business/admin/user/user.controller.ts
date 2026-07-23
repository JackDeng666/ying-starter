import { Controller, Get, Query, Res } from '@nestjs/common'
import { Response } from 'express'
import { ListUserDto } from '@ying/dto'
import { pms } from '@ying/permission'
import { AdminScope, PermissionDecorator } from '@/common/decorator'
import { UserService } from '@/business/modules/user'

@PermissionDecorator(pms.user)
@AdminScope()
@Controller('admin/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('list')
  list(@Query() dto: ListUserDto) {
    return this.userService.list(dto)
  }

  @Get('list-count')
  listCount(@Query() dto: ListUserDto) {
    return this.userService.listCount(dto)
  }

  @PermissionDecorator(pms.user.export)
  @Get('export')
  async exportBlindBoxInfo(@Query() dto: ListUserDto, @Res() res: Response) {
    const exportRes = await this.userService.export(dto)
    if (!exportRes) {
      res.send(500)
      return
    }
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(exportRes.fileName)}.xlsx"`)
    res.send(exportRes.excelBuffer)
  }
}
