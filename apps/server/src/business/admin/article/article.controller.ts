import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { CreateArticleDto, UpdateArticleDto, ListArticleDto, DeleteDto, UpdateArticleContentDto } from '@ying/dto'
import { AdminScope } from '@/common/decorator'
import { ArticleService } from '@/business/modules/article'

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

  @Put('content')
  updateContent(@Body() dto: UpdateArticleContentDto) {
    return this.articleService.updateContent(dto)
  }

  @Get('list')
  list(@Query() dto: ListArticleDto) {
    return this.articleService.list(dto)
  }

  @Get('list-count')
  listCount(@Query() dto: ListArticleDto) {
    return this.articleService.listCount(dto)
  }

  @Delete()
  delete(@Body() dto: DeleteDto) {
    return this.articleService.delete(dto.ids)
  }

  @Get(':id')
  detail(@Param('id') id: number) {
    return this.articleService.detail(id)
  }
}
