import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Like, Repository } from 'typeorm'

import { ListArticleDto } from '@ying/shared'
import { ArticleEntity } from '@ying/shared/entities'

import { BaseService } from '@/server/common/service/base.service'

@Injectable()
export class ArticleService extends BaseService<ArticleEntity> {
  constructor(
    @InjectRepository(ArticleEntity)
    readonly articleRepository: Repository<ArticleEntity>
  ) {
    super(articleRepository)
  }

  buildListQuery(dto: ListArticleDto) {
    const listQuery = super.buildListQuery(dto)
    const { name, status } = dto
    Object.assign(listQuery.where, {
      name: name ? Like(`%${name}%`) : undefined,
      status
    })
    return listQuery
  }

  list(dto: ListArticleDto) {
    const { where, skip, take } = this.buildListQuery(dto)

    return this.articleRepository.find({
      where,
      skip,
      take,
      order: {
        createAt: 'DESC'
      },
      relations: {
        cover: true
      }
    })
  }

  listCount(dto: ListArticleDto) {
    const { where } = this.buildListQuery(dto)
    return this.articleRepository.countBy(where)
  }

  detail(id: number) {
    return this.articleRepository.findOne({
      where: { id },
      relations: {
        cover: true
      }
    })
  }

  async view(id: number) {
    await this.articleRepository.increment({ id }, 'view', 1)
  }
}
