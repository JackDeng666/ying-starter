import axios, { AxiosError } from 'axios'
import { message as Message } from 'antd'
import { storage } from '@ying/utils'
import { clearUserInfoAndToken } from '@/admin/store'
import { StorageEnum } from '@/admin/types/enum'
import { UserTokenVo } from '@ying/shared'

export const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API
})

export type ErrorRes = {
  status: number
  message: string | string[]
  timestamp?: string
  path?: string
  [key: string]: unknown
}

request.interceptors.request.use(config => {
  const token = storage.getItem<UserTokenVo>(StorageEnum.Token)
  if (token) {
    config.headers.Authorization = `Bearer ${token.accessToken}`
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
        Message.error(msg[0])
      } else {
        Message.error(msg)
      }
      return Promise.reject(res.data)
    }
    return Promise.reject(error)
  }
)
