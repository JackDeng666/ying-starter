import { createFileRoute } from '@tanstack/react-router'
import z from 'zod'
import { articleAPI } from '@/api/server'
import { ArticleDetail } from './-article-detail'

export const Route = createFileRoute('/$lang/article/$id/')({
  params: z.object({
    id: z.coerce.number().positive()
  }),
  loader: ({ params }) => articleAPI.detail(params.id),
  component: RouteComponent
})

function RouteComponent() {
  const article = Route.useLoaderData()

  return <ArticleDetail article={article} />
}
