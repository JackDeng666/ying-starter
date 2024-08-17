import { articleApi } from '@/client/api/server'
import { ArticleDetail } from './article-detail'

type PageProps = {
  params: {
    id?: string
  }
}

export default async function Page({ params: { id } }: PageProps) {
  if (!id) return null
  const data = await articleApi.getArticle(id)
  if (!data.data) return null

  return <ArticleDetail article={data.data} />
}
