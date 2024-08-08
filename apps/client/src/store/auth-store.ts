import { useCallback } from 'react'
import { create } from 'zustand'
import Cookies from 'js-cookie'
import { ClientUserVo, ClientAuthVo } from '@ying/shared'
import { ms } from '@ying/utils'
import { AppKey } from '@/client/enum'
import { TAppContext, useAppContext } from '@/client/providers/app'
import { useVisitor } from '@/client/hooks/use-visitor'
import { useApi } from './app-store'

interface AuthStore {
  userInfo?: ClientUserVo
  authToken: Partial<ClientAuthVo>
  setUserInfo: (userInfo: ClientUserVo) => void
  setAuthToken: (authToken: ClientAuthVo) => void
}

export const useAuthStore = create<AuthStore>(set => ({
  userInfo: undefined,
  authToken: {
    accessToken: Cookies.get(AppKey.CookieAccessTokenKey),
    refreshToken: Cookies.get(AppKey.CookieRefreshTokenKey)
  },
  setUserInfo: userInfo => set({ userInfo }),
  setAuthToken: authToken => set({ authToken })
}))

export const clearUserInfoAndToken = ({ domain }: TAppContext) => {
  useAuthStore.setState({ userInfo: undefined, authToken: { accessToken: undefined, refreshToken: undefined } })
  Cookies.remove(AppKey.CookieAccessTokenKey, { domain })
  Cookies.remove(AppKey.CookieRefreshTokenKey, { domain })
}

export const updateAccessToken = (accessToken: string, { domain, accessTokenExpiresIn }: TAppContext) => {
  const authToken = useAuthStore.getState().authToken
  useAuthStore.setState({ authToken: { ...authToken, accessToken } })
  Cookies.set(AppKey.CookieAccessTokenKey, accessToken, {
    domain,
    expires: new Date(Date.now() + ms(accessTokenExpiresIn))
  })
}

export const useAuth = () => {
  const appContext = useAppContext()
  const { authApi, userApi, commonApi } = useApi()
  const { visitor, storeVisitor } = useVisitor()

  const logout = useCallback(async () => {
    if (!authApi) return
    await authApi.logout()
    clearUserInfoAndToken(appContext)
  }, [authApi, appContext])

  const getProfile = useCallback(async () => {
    if (!userApi || !visitor || !commonApi) return
    const userInfo = await userApi.getProfile()
    useAuthStore.setState({ userInfo })
    if (!visitor.userId) {
      const newVisitor = await commonApi.bindUser(visitor.id)
      storeVisitor(newVisitor)
    }
  }, [userApi, visitor, commonApi, storeVisitor])

  return {
    logout,
    getProfile
  }
}
