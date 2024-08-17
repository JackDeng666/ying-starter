import { instanceToPlain } from 'class-transformer'
import { ListArticleDto } from '@ying/shared'
import { API_URL, serverFetch } from './fetch'
import { ArticleEntity } from '@ying/shared/entities'

export const lisArticle = async (params: ListArticleDto) => {
  const url = new URL(`${API_URL}/article/list`)
  url.search = new URLSearchParams(instanceToPlain(params)).toString()
  return serverFetch<ArticleEntity[]>(url)
}

export const getArticle = async (id: string) => {
  return serverFetch<ArticleEntity>(`/article/${id}`)
}
