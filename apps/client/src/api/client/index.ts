import { initRequest } from './request'
import { AuthApi } from './auth'
import { FileApi } from './file'
import { UserApi } from './user'

export { AuthApi, FileApi, UserApi }

export const initApi = (baseURL: string, domain: string) => {
  const request = initRequest(baseURL, domain)

  const authApi = new AuthApi(request)
  const fileApi = new FileApi(request)
  const userApi = new UserApi(request)

  return {
    authApi,
    fileApi,
    userApi
  }
}
