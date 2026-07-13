import { HttpRequest, type BeforeRequestHookOptions } from '@ying/http'
import { isBaseVo } from '@ying/vo'
import { useUserStore, clearUserInfoAndAuthTokens, setAuthTokens } from '@/store'
import { globalEvent } from '@/event-emitter'

import { HttpError } from './http-error'

let refreshTokenPromise: Promise<string | undefined>

async function refreshToken(http: HttpRequest) {
  if (refreshTokenPromise) {
    return refreshTokenPromise
  }
  refreshTokenPromise = new Promise(resolve => {
    async function refresh() {
      try {
        const authTokens = useUserStore.getState().authTokens
        const accessToken = await http.get<string>('/sys/auth/refresh', {
          headers: {
            authorization: `Bearer ${authTokens.refreshToken}`
          },
          additional: {
            __isRefreshToken: true
          }
        })
        setAuthTokens({ ...authTokens, accessToken })
        resolve(accessToken)
      } catch (error) {
        console.log(error)
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
    const { accessToken } = useUserStore.getState().authTokens
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
    const errRes = await fetchRes.json()
    const httpError = new HttpError(errRes, {
      status: fetchRes.status,
      statusText: fetchRes.statusText
    })
    globalEvent.emit('API_ERROR_MSG', httpError.message)
    return httpError
  }
})
