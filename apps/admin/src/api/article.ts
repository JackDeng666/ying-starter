import { CreateArticleDto, UpdateArticleDto, ListArticleDto } from '@ying/shared'
import { ArticleEntity } from '@ying/shared/entities'
import { request, timeDataTransform } from './request'

export function list(params: ListArticleDto): Promise<ArticleEntity[]> {
  return request.get('/article/list', { params: timeDataTransform(params, 'date') })
}

export function listCount(params: ListArticleDto): Promise<number> {
  return request.get('/article/list-count', { params: timeDataTransform(params, 'date') })
}

export function create(data: CreateArticleDto) {
  return request.post('/article', data)
}

export function update(data: UpdateArticleDto) {
  return request.put('/article', data)
}

export function del(id: number) {
  return request.delete(`/article/${id}`)
}
