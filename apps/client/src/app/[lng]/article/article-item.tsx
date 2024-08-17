'use client'

import dayjs from 'dayjs'
import { LuEye } from 'react-icons/lu'
import { ArticleEntity } from '@ying/shared/entities'
import { useRouter } from '@/client/store/app-store'
import { Badge } from '@/client/components/ui/badge'

type ArticleItemProps = {
  article: ArticleEntity
}

export const ArticleItem = ({ article }: ArticleItemProps) => {
  const router = useRouter()

  return (
    <div
      className="bg-background rounded-md overflow-hidden cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md flex flex-col sm:flex-row sm:h-[160px] text-gray-500"
      onClick={() => router.push(`/article/${article.id}`)}
    >
      <div className="relative pb-[calc(5_/_9_*_100%)] w-auto sm:pb-0 sm:w-[290px]">
        <img className="absolute h-full w-full object-cover" alt={article.title} src={article.cover.url} />
      </div>
      <div className="flex-1 text-base p-3 gap-2 flex flex-col justify-between">
        <div>
          <div className="text-xl">{article.title}</div>
          <div className="flex gap-2 flex-wrap mt-2">
            {article.keywords?.map(el => (
              <Badge variant="secondary" className="text-xs px-2" key={el}>
                {el}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex justify-between flex-wrap">
          <div className="flex items-center gap-2">
            <LuEye />
            {article.view}
          </div>
          <div>{dayjs(article.createAt).format('YYYY-MM-DD HH:mm:ss')}</div>
        </div>
      </div>
    </div>
  )
}
