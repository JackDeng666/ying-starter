import { TAppContext } from '@/client/providers/app'
import { initRequest } from './request'
import { AuthApi } from './auth'
import { UserApi } from './user'
import { CommonApi } from './common'

export { AuthApi, UserApi, CommonApi }

export type API = {
  authApi?: AuthApi
  userApi?: UserApi
  commonApi?: CommonApi
}

export const initApi = (appContext: TAppContext) => {
  const request = initRequest(appContext)

  const authApi = new AuthApi(request)
  const userApi = new UserApi(request)
  const commonApi = new CommonApi(request)

  return {
    authApi,
    userApi,
    commonApi
  }
}
