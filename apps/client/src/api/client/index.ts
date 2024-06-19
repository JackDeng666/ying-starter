import { TAppContext } from '@/client/providers/app'
import { initRequest } from './request'
import { AuthApi } from './auth'
import { FileApi } from './file'
import { UserApi } from './user'

export { AuthApi, FileApi, UserApi }

export type API = {
  authApi?: AuthApi
  fileApi?: FileApi
  userApi?: UserApi
}

export const initApi = (appContext: TAppContext) => {
  const request = initRequest(appContext)

  const authApi = new AuthApi(request)
  const fileApi = new FileApi(request)
  const userApi = new UserApi(request)

  return {
    authApi,
    fileApi,
    userApi
  }
}
