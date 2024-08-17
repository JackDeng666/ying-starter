import { Module } from '@nestjs/common'
import { ArticleModule as BaseArticleModule } from '@/server/business/modules/article/article.module'
import { ArticleController } from './article.controller'

@Module({
  imports: [BaseArticleModule],
  controllers: [ArticleController]
})
export class ArticleModule {}
