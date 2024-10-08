import { create } from 'zustand'

import { UserTokenVo } from '@ying/shared'
import { SysUserEntity } from '@ying/shared/entities'
import { storage } from '@ying/fontend-shared/utils'

import { authApi } from '@/admin/api'
import { StorageEnum } from '@/admin/types/enum'

type UserStore = {
  userInfo: Partial<SysUserEntity>
  userToken: UserTokenVo
}

const useUserStore = create<UserStore>(() => ({
  userInfo: storage.getItem<SysUserEntity>(StorageEnum.User) || {},
  userToken: storage.getItem<UserTokenVo>(StorageEnum.Token) || {}
}))

export const useUserInfo = () => useUserStore(state => state.userInfo)
export const useUserToken = () => useUserStore(state => state.userToken)
export const useUserPermission = () => useUserStore(state => state.userInfo.permissions)

export const setUserInfo = (userInfo: Partial<SysUserEntity>) => {
  useUserStore.setState({ userInfo })
  storage.setItem(StorageEnum.User, userInfo)
}

export const setUserToken = (userToken: UserTokenVo) => {
  useUserStore.setState({ userToken })
  storage.setItem(StorageEnum.Token, userToken)
}

export const clearUserInfoAndToken = () => {
  useUserStore.setState({ userInfo: {}, userToken: {} })
  storage.removeItem(StorageEnum.User)
  storage.removeItem(StorageEnum.Token)
}

export const getUserInfo = async () => {
  const userInfo = await authApi.getUserInfo()
  storage.setItem(StorageEnum.User, userInfo)
  useUserStore.setState({ userInfo })

  return userInfo
}

export const logout = async () => {
  await authApi.logout()
  clearUserInfoAndToken()
}
