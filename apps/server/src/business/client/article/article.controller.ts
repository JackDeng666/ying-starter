import { Controller, Get, Param, Query } from '@nestjs/common'
import { ListArticleDto } from '@ying/shared'
import { ClientScope, Public } from '@/server/common/decorator'
import { ArticleService } from '@/server/business/modules/article/article.service'

@Public()
@ClientScope()
@Controller('client/article')
export class ArticleController {
  constructor(readonly articleService: ArticleService) {}

  @Get('list')
  list(@Query() dto: ListArticleDto) {
    return this.articleService.list(dto)
  }

  @Get(':id')
  detail(@Param('id') id: number) {
    return this.articleService.detail(id)
  }

  @Get(':id/view')
  view(@Param('id') id: number) {
    return this.articleService.view(id)
  }
}
