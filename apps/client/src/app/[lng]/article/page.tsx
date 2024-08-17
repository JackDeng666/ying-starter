import { articleApi } from '@/client/api/server'
import { ArticleList } from './article-list'

type PageProps = {
  searchParams: {
    page?: string
  }
}

export default async function Page({ searchParams: { page } }: PageProps) {
  const initPage = Number(page || 1)
  const data = await articleApi.lisArticle({ page: initPage, size: 20 })

  if (!data.data) return null

  return <ArticleList initList={data.data} initPage={initPage} />
}
