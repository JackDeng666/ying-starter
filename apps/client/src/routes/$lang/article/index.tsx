import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { articleAPI } from '@/api/server'

import { ArticleList } from './-article-list'

export const Route = createFileRoute('/$lang/article/')({
  validateSearch: z.object({
    page: z.number().positive().optional()
  }),
  loaderDeps: ({ search }) => ({ page: search.page }),
  loader: async ({ deps: { page } }) => {
    const [initialList, initialListCount] = await Promise.all([articleAPI.list({ page }), articleAPI.listCount()])
    return {
      initialPage: page,
      initialList,
      initialListCount
    }
  },
  component: RouteComponent
})

function RouteComponent() {
  const props = Route.useLoaderData()
  return <ArticleList {...props} />
}
