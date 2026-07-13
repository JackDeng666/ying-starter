import { HttpRequest, type BeforeRequestHookOptions } from '@ying/http'
import { isBaseVo } from '@ying/vo'
import { useAuthStore, updateAccessToken, clearUserInfoAndAuthTokens } from '@/store/auth-store'
import { HttpError } from './http-error'

let refreshTokenPromise: Promise<string | undefined> | undefined

async function refreshToken(http: HttpRequest) {
  if (refreshTokenPromise) {
    return refreshTokenPromise
  }
  refreshTokenPromise = new Promise(resolve => {
    async function refresh() {
      try {
        const state = useAuthStore.getState()
        const accessToken = await http.get<string>('/auth/refresh', {
          headers: {
            authorization: `Bearer ${state.refreshToken}`
          },
          additional: {
            __isRefreshToken: true
          }
        })
        updateAccessToken(accessToken)
        resolve(accessToken)
      } catch (error) {
        resolve(undefined)
      }
    }
    refresh()
  })
  return refreshTokenPromise
}

function isRefreshRequest(options: BeforeRequestHookOptions) {
  return !!options.additional?.__isRefreshToken
}

export const http = new HttpRequest({
  baseURL: import.meta.env.APP_API_BASE
})

http.addHooks({
  beforeRequest: options => {
    const { accessToken } = useAuthStore.getState()
    if (accessToken && !options.headers['authorization']) {
      options.headers['authorization'] = `Bearer ${accessToken}`
    }
    return options
  },
  afterResponse: ({ type, data }) => {
    if (type === 'json' && isBaseVo(data)) return data.data
    return data
  },
  beforeError: async (fetchRes, options) => {
    if (fetchRes.status === 401 && !isRefreshRequest(options)) {
      const accessToken = await refreshToken(http)
      refreshTokenPromise = undefined
      if (accessToken) {
        options.headers['authorization'] = `Bearer ${accessToken}`
        return http.request({ ...options, responseType: 'raw' })
      }
    }
    return fetchRes
  },
  afterError: async fetchRes => {
    if (fetchRes.status === 401) clearUserInfoAndAuthTokens()
    return fetchRes.json().then(
      res =>
        new HttpError(res, {
          status: fetchRes.status,
          statusText: fetchRes.statusText
        })
    )
  }
})
