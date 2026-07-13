import { Controller, Get, Query, Res } from '@nestjs/common'
import { Response } from 'express'
import { ListUserDto } from '@ying/dto'
import { AdminScope, PermissionDecorator } from '@/common/decorator'
import { UserService } from '@/business/modules/user'
import { pms } from '@ying/permission'

@Controller('admin/user')
@AdminScope()
@PermissionDecorator(pms.user)
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
