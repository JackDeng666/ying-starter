'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth, useAuthStore } from '@/client/store/auth-store'
import { LayoutProps } from '@/client/types'
import { Navbar } from './navbar'

export const CardWrapper = ({ children }: LayoutProps) => {
  const router = useRouter()
  const userToken = useAuthStore(state => state.userToken)
  const { getProfile } = useAuth()

  useEffect(() => {
    if (!userToken) router.replace('/')
  }, [userToken, router])

  useEffect(() => {
    getProfile && getProfile()
  }, [getProfile])

  return (
    <div className="w-full sm:w-[540px] h-full sm:h-[600px] bg-secondary rounded-none sm:rounded-lg shadow-lg flex flex-col">
      <Navbar />
      {children}
    </div>
  )
}
