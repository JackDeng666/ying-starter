import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { CreateArticleDto, UpdateArticleDto, ListArticleDto } from '@ying/shared'
import { AdminScope } from '@/server/common/decorator'
import { ArticleService } from '@/server/business/modules/article/article.service'

@Controller('admin/article')
@AdminScope()
export class ArticleController {
  constructor(readonly articleService: ArticleService) {}

  @Post()
  create(@Body() dto: CreateArticleDto) {
    return this.articleService.create(dto)
  }

  @Put()
  update(@Body() dto: UpdateArticleDto) {
    return this.articleService.updateById(dto.id, dto)
  }

  @Get('list')
  list(@Query() dto: ListArticleDto) {
    return this.articleService.list(dto)
  }

  @Get('list-count')
  listCount(@Query() dto: ListArticleDto) {
    return this.articleService.listCount(dto)
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.articleService.delete(id)
  }
}
