import { Module } from '@nestjs/common'
import { ArticleModule as BaseArticleModule } from '@/business/modules/article'
import { ArticleController } from './article.controller'

@Module({
  imports: [BaseArticleModule],
  controllers: [ArticleController]
})
export class ArticleModule {}
