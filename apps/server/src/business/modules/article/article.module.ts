import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ArticleEntity } from '@ying/shared/entities'

import { ArticleService } from './article.service'

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity])],
  providers: [ArticleService],
  exports: [ArticleService]
})
export class ArticleModule {}
