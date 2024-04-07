import { create } from 'zustand'
import Cookies from 'js-cookie'
import { ClientUserVo } from '@shared'
import { AppKey } from '@/enum'
import { useApi } from './api-store'
import { useAppContext } from '@/components/app-provider'

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
    await authApi.logout()
    clearUserInfoAndToken(domain)
  }

  const getProfile = async () => {
    const userInfo = await userApi.getProfile()
    useAuthStore.setState({ userInfo })
  }

  return {
    logout,
    getProfile
  }
}
