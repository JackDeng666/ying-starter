import { BeforeRequestHookOptions, HttpRequest } from '@ying/http'
import { setAccessToken } from '@/store'

let refreshTokenPromise: Promise<void>

export async function refreshToken(http: HttpRequest) {
  if (refreshTokenPromise) return refreshTokenPromise
  refreshTokenPromise = new Promise((resolve, reject) => {
    http
      .get<string>('/sys/auth/refresh', {
        additional: {
          __isRefreshToken: true
        }
      })
      .then(accessToken => {
        setAccessToken(accessToken)
        resolve()
      })
      .catch(error => {
        console.log(error)
        reject()
      })
      .finally(() => {
        refreshTokenPromise = undefined
      })
  })
  return refreshTokenPromise
}

export function isRefreshRequest(options: BeforeRequestHookOptions) {
  return !!options.additional?.__isRefreshToken
}
