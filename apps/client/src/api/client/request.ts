import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios'
import Cookies from 'js-cookie'
import { AppKey } from '@/client/enum'
import { clearUserInfoAndToken, updateAccessToken } from '@/client/store/auth-store'
import { TAppContext } from '@/client/providers/app'

export type ErrorRes = {
  status: number
  message: string | string[]
  timestamp?: string
  path?: string
  [key: string]: unknown
}

export const initRequest = (appContext: TAppContext) => {
  const request = axios.create({
    baseURL: appContext.apiUrl
  })
  request.interceptors.request.use(config => {
    const token = Cookies.get(AppKey.CookieAccessTokenKey)
    const lng = Cookies.get(AppKey.CookieLanguageKey)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    if (lng) {
      config.headers['custom-lng'] = lng
    }
    return config
  })
  request.interceptors.response.use(
    response => {
      const data = response.data.data
      if (data !== null || data !== undefined) {
        return data
      }
      return response.data
    },
    async (error: AxiosError<ErrorRes>) => {
      const res = error.response
      if (res) {
        if (res.status === 401 && !isRefreshRequest(res.config)) {
          const isSuccess = await refreshToken(request, appContext)
          if (isSuccess) {
            return request.request(res.config)
          } else {
            clearUserInfoAndToken(appContext)
          }
        }
        const msg = res.data.message
        if (Array.isArray(msg)) {
        } else {
        }
        return Promise.reject(res.data)
      }
      return Promise.reject(error)
    }
  )

  return request
}

let promise

async function refreshToken(request: AxiosInstance, appContext: TAppContext) {
  if (promise) {
    return promise
  }

  promise = new Promise(resolve => {
    async function getRefreshToken() {
      try {
        const refreshToken = Cookies.get(AppKey.CookieRefreshTokenKey)
        const accessToken = (await request.get('/auth/refresh', {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
            __isRefreshToken: true
          }
        })) as string

        updateAccessToken(accessToken, appContext)

        resolve(true)
      } catch (error) {
        resolve(false)
      }
    }

    getRefreshToken()
  })

  return promise
}

function isRefreshRequest(config: AxiosRequestConfig) {
  return !!config.headers?.__isRefreshToken
}

export class BaseApi {
  request: AxiosInstance
  constructor(request: AxiosInstance) {
    this.request = request
  }
}
