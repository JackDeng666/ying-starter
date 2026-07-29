import { HttpRequest, type BeforeRequestHookOptions } from '@ying/http'
import { isBaseVo } from '@ying/vo'
import { clearUserStore, setAccessToken } from '@/store'
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
        const accessToken = await http.get<string>('/sys/auth/refresh', {
          additional: {
            __isRefreshToken: true
          }
        })
        setAccessToken(accessToken)
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
  afterResponse: ({ type, data }) => {
    if (type === 'json' && isBaseVo(data)) return data.data
    return data
  },
  beforeError: async (fetchRes, options) => {
    if (fetchRes.status === 401 && !isRefreshRequest(options)) {
      await refreshToken(http)
      refreshTokenPromise = undefined
      return http.request({ ...options, responseType: 'raw' })
    }
    return fetchRes
  },
  afterError: async fetchRes => {
    if (fetchRes.status === 401) clearUserStore()
    const errRes = await fetchRes.json()
    const httpError = new HttpError(errRes, {
      status: fetchRes.status,
      statusText: fetchRes.statusText
    })
    globalEvent.emit('API_ERROR_MSG', httpError.message)
    return httpError
  }
})
