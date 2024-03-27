import axios, { AxiosError } from 'axios'
import Cookies from 'js-cookie'
import { AppKey } from '@/enum'
import { clearUserInfoAndToken } from '@/store/auth-store'

export const request = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
})

export type ErrorRes = {
  status: number
  message: string | string[]
  timestamp?: string
  path?: string
  [key: string]: unknown
}

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
        clearUserInfoAndToken()
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
