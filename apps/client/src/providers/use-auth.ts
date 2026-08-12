import { useEffect } from 'react'
import { useRouter } from '@tanstack/react-router'

import { useAuthStore, updateUserInfo } from '@/store/auth-store'

export const useAuth = () => {
  const refreshToken = useAuthStore(state => state.refreshToken)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = useAuthStore.subscribe((cur, prev) => {
      if (cur.accessToken !== prev.accessToken) {
        // 重新触发 beforeLoad
        router.invalidate()
      }
    })
    return unsubscribe
  }, [router])

  useEffect(() => {
    if (refreshToken) {
      updateUserInfo()
    }
  }, [refreshToken])
}
