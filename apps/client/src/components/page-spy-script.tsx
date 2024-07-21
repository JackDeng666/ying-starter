'use client'

import { useCallback, useEffect, useState } from 'react'
import Script from 'next/script'

import { useAppContext } from '@/client/providers/app'
import { useAuthStore } from '@/client/store/auth-store'
import { useApi } from '@/client/store/app-store'

export const PageSpyScript = () => {
  const [loaded, setLoaded] = useState(false)
  const { commonApi } = useApi()
  const { pageSpyUrl, pageSpyProject } = useAppContext()

  const userInfo = useAuthStore(state => state.userInfo)

  const initPageSpy = useCallback(async () => {
    if (!loaded || !userInfo || !commonApi) return

    const shouldDebug = await commonApi.checkLiveDebug()

    if (shouldDebug) {
      const title = `${userInfo.id}:${userInfo.email}`
      window.$pageSpy = new PageSpy({
        autoRender: false,
        project: pageSpyProject,
        title
      })
    }
  }, [loaded, userInfo, pageSpyProject, commonApi])

  useEffect(() => {
    initPageSpy()
  }, [initPageSpy])

  return (
    <Script
      src={`${pageSpyUrl}/page-spy/index.min.js`}
      onLoad={() => {
        setLoaded(true)
      }}
    />
  )
}
