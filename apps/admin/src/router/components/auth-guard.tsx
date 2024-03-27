import { useCallback, useEffect } from 'react'

import { getUserInfo, useUserToken } from '@/store'

import { useRouter } from '../hooks'

type Props = {
  children: React.ReactNode
}
export default function AuthGuard({ children }: Props) {
  const router = useRouter()
  const { accessToken } = useUserToken()

  const check = useCallback(() => {
    if (!accessToken) {
      router.replace('/login')
    }
  }, [router, accessToken])

  useEffect(() => {
    check()
  }, [check])

  useEffect(() => {
    if (accessToken) getUserInfo()
  }, [accessToken])

  return children
}
