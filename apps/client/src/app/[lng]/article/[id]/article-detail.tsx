'use client'

import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { LuEye } from 'react-icons/lu'
import dayjs from 'dayjs'

import { ArticleEntity } from '@ying/shared/entities'

import { MaxWidthWrapper } from '@/client/components/max-width-wrapper'
import { Badge } from '@/client/components/ui/badge'
import { RichText } from '@/client/components/rich-text'
import { useApi } from '@/client/store/app-store'
import { useTranslate } from '@/client/i18n/client'

type ArticleDetailProps = {
  article: ArticleEntity
}

export const ArticleDetail = ({ article }: ArticleDetailProps) => {
  const { i18n } = useTranslate()
  const { articleApi } = useApi()

  const bottomRef = useRef(null)
  const inView = useInView(bottomRef, { once: true })

  useEffect(() => {
    if (!articleApi) return
    if (inView) {
      articleApi.view(article.id)
    }
  }, [inView, articleApi, article])

  return (
    <MaxWidthWrapper className="py-4 md:px-4 max-w-screen-md">
      <div className="bg-background rounded-md overflow-hidden transition-all duration-300 shadow-sm flex flex-col text-gray-500">
        <div className="relative pb-[calc(5_/_9_*_100%)]">
          <img
            className="absolute h-full w-full object-cover"
            alt={article.title[i18n.language]}
            src={article.cover.url}
          />
        </div>
        <div className="flex-1 text-base p-4 pb-2 gap-2 flex flex-col justify-between">
          <div>
            <div className="text-xl">{article.title[i18n.language]}</div>
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
          <RichText text={article.content?.[i18n.language]} />
        </div>
        <motion.div ref={bottomRef} className="opacity-0" />
      </div>
    </MaxWidthWrapper>
  )
}
