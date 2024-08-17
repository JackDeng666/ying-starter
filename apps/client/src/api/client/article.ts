import { ListArticleDto } from '@ying/shared'
import { ArticleEntity } from '@ying/shared/entities'
import { BaseApi } from './request'

export class ArticleApi extends BaseApi {
  list(params: ListArticleDto): Promise<ArticleEntity[]> {
    return this.request.get('/article/list', { params })
  }

  detail(id: number): Promise<ArticleEntity> {
    return this.request.get(`/article/${id}`)
  }

  view(id: number) {
    return this.request.get(`/article/${id}/view`)
  }
}
