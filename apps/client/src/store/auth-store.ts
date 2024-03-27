import { create } from 'zustand'
import Cookies from 'js-cookie'
import { ClientUserVo } from '@shared'
import { authApi, userApi } from '@/api/client'
import { AppKey } from '@/enum'

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

export const clearUserInfoAndToken = () => {
  useAuthStore.setState({ userInfo: undefined, userToken: undefined })
  Cookies.remove(AppKey.CookieTokenKey)
}

export const logout = async () => {
  await authApi.logout()
  clearUserInfoAndToken()
}

export const getProfile = async () => {
  const userInfo = await userApi.getProfile()
  useAuthStore.setState({ userInfo })
}
