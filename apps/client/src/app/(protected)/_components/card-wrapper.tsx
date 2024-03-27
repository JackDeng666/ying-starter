'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { getProfile, useAuthStore } from '@/store/auth-store'
import { LayoutProps } from '@/types'
import { Navbar } from './navbar'
import { AppKey } from '@/enum'

export const CardWrapper = ({ children }: LayoutProps) => {
  const router = useRouter()
  const search = useSearchParams()
  const queryToken = search.get(AppKey.QueryTokenKey)
  const userToken = useAuthStore(state => state.userToken)

  useEffect(() => {
    if (!userToken) router.replace('/')
  }, [userToken, router])

  useEffect(() => {
    if (!queryToken) getProfile()
  }, [queryToken])

  return (
    <div className="w-full sm:w-[540px] h-full sm:h-[600px] bg-secondary rounded-none sm:rounded-lg shadow-lg flex flex-col">
      <Navbar />
      {children}
    </div>
  )
}
