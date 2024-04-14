import { create } from 'zustand'
import Cookies from 'js-cookie'
import { ClientUserVo } from '@ying/shared'
import { AppKey } from '@/client/enum'
import { useApi } from './api-store'
import { useAppContext } from '@/client/components/app-provider'

interface AuthStore {
  userInfo?: ClientUserVo
  userToken?: string
  setUserInfo: (userInfo: ClientUserVo) => void
  setUserToken: (token: string) => void
}

export const useAuthStore = create<AuthStore>(set => ({
  userInfo: undefined,
  userToken: Cookies.get(AppKey.CookieTokenKey),
  setUserInfo: userInfo => set({ userInfo }),
  setUserToken: userToken => set({ userToken })
}))

export const clearUserInfoAndToken = (domain: string) => {
  useAuthStore.setState({ userInfo: undefined, userToken: undefined })
  Cookies.remove(AppKey.CookieTokenKey, { domain })
}

export const useAuth = () => {
  const { domain } = useAppContext()
  const { authApi, userApi } = useApi()

  const logout = async () => {
    if (!authApi) return
    await authApi.logout()
    clearUserInfoAndToken(domain)
  }

  const getProfile = async () => {
    if (!userApi) return
    const userInfo = await userApi.getProfile()
    useAuthStore.setState({ userInfo })
  }

  return {
    logout,
    getProfile
  }
}
