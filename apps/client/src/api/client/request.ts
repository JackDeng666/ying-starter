import axios, { AxiosError, AxiosInstance } from 'axios'
import Cookies from 'js-cookie'
import { AppKey } from '@/client/enum'
import { clearUserInfoAndToken } from '@/client/store/auth-store'

export type ErrorRes = {
  status: number
  message: string | string[]
  timestamp?: string
  path?: string
  [key: string]: unknown
}

export const initRequest = (baseURL: string, domain: string) => {
  const request = axios.create({
    baseURL
  })
  request.interceptors.request.use(config => {
    const token = Cookies.get(AppKey.CookieTokenKey)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })
  request.interceptors.response.use(
    response => {
      if (response.data.data) {
        return response.data.data
      }
      return response.data
    },
    (error: AxiosError<ErrorRes>) => {
      const res = error.response
      if (res) {
        if (res.status === 401) {
          clearUserInfoAndToken(domain)
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

export class BaseApi {
  request: AxiosInstance
  constructor(request: AxiosInstance) {
    this.request = request
  }
}
