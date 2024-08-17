'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

import { delyFunc } from '@ying/utils'
import { ArticleEntity } from '@ying/shared/entities'

import { MaxWidthWrapper } from '@/client/components/max-width-wrapper'
import { LoadingIcon } from '@/client/components/ui/icons'
import { useApi } from '@/client/store/app-store'
import { useTranslate } from '@/client/i18n/client'

import { ArticleItem } from './article-item'

type ArticleListProps = {
  initList: ArticleEntity[]
  initPage: number
}

const size = 20

export const ArticleList = ({ initList, initPage }: ArticleListProps) => {
  const { t } = useTranslate()
  const { articleApi } = useApi()
  const loadingRef = useRef(null)
  const inView = useInView(loadingRef)

  const pageRef = useRef(initPage)
  const [list, setList] = useState<ArticleEntity[]>(initList)
  const [isEmpty, setIsEmpty] = useState(initList.length < size)

  const loadMore = useCallback(async () => {
    if (!articleApi) return
    const getList = delyFunc(articleApi.list.bind(articleApi), 1000)
    const res = await getList({ page: pageRef.current, size })
    setList(prev => [...prev, ...res])
    if (res.length < size) {
      setIsEmpty(true)
    }
  }, [articleApi])

  useEffect(() => {
    if (inView && !isEmpty) {
      pageRef.current += 1
      loadMore()
    }
  }, [inView, isEmpty, loadMore])

  return (
    <MaxWidthWrapper className="py-4 md:px-4 max-w-screen-md">
      <div className="flex flex-col gap-4 break-words">
        {list.map(el => (
          <ArticleItem key={el.id} article={el} />
        ))}
      </div>
      <motion.div
        ref={loadingRef}
        className="w-full h-20 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={inView && { opacity: 1 }}
      >
        {!isEmpty && <LoadingIcon className="text-3xl text-primary" />}
        {isEmpty && <p className="text-slate-500">{t('no_more')}</p>}
      </motion.div>
    </MaxWidthWrapper>
  )
}
