import { useCallback } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { SysUserEntity } from '@ying/entity'
import type { AdminAuthVo } from '@ying/vo'
import type { TPermission } from '@ying/permission'

import { authApi } from '@/api'

type UserStore = {
  userInfo: Partial<SysUserEntity>
  authTokens: Partial<AdminAuthVo>
}

export const useUserStore = create<UserStore>()(
  persist(
    () => ({
      userInfo: {},
      authTokens: {}
    }),
    {
      name: 'user_store'
    }
  )
)

export const useUserInfo = () => useUserStore(state => state.userInfo)
export const useAuthTokens = () => useUserStore(state => state.authTokens)
export const useUserPermission = () => useUserStore(state => state.userInfo.permissions)

export const useHasPermission = () => {
  const permissions = useUserPermission()
  const hasPermission = useCallback(
    (pm: TPermission) => {
      if (!permissions || !pm.code) return false
      return permissions.map(el => el.code).includes(pm.code)
    },
    [permissions]
  )
  return hasPermission
}

export const setUserInfo = (userInfo: Partial<SysUserEntity>) => {
  useUserStore.setState({ userInfo })
}

export const setAuthTokens = (authTokens: Partial<AdminAuthVo>) => {
  useUserStore.setState({ authTokens })
}

export const clearUserInfoAndAuthTokens = () => {
  useUserStore.setState({ userInfo: {}, authTokens: {} })
}

export const updateUserInfo = async () => {
  const userInfo = await authApi.getUserInfo()
  setUserInfo(userInfo)
}

export const logout = async () => {
  await authApi.logout()
  clearUserInfoAndAuthTokens()
}
