import { Controller, Get, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { StatDto } from '@ying/shared'

import { AdminScope } from '@/server/common/decorator'
import { UserStatService } from '@/server/business/modules/user/user.stat.service'

@ApiTags('admin user stat')
@Controller('admin/user-stat')
@AdminScope()
export class UserStatController {
  constructor(readonly userStatService: UserStatService) {}

  @Get('growth-total')
  getUserGrowthTotal() {
    return this.userStatService.getUserGrowthTotal()
  }

  @Get('growth-trend-all')
  getUserGrowthTrendAll(@Query() dto: StatDto) {
    return this.userStatService.getUserGrowthTrendAll(dto)
  }

  @Get('growth-trend')
  getUserGrowthTrend(@Query() dto: StatDto) {
    return this.userStatService.getUserGrowthTrend(dto)
  }
}
