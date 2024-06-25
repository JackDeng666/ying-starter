import axios, { AxiosError } from 'axios'
import { message as Message } from 'antd'
import dayjs from 'dayjs'
import _ from 'lodash'

import { storage } from '@ying/utils'
import { UserTokenVo } from '@ying/shared'

import { clearUserInfoAndToken } from '@/admin/store'
import { StorageEnum } from '@/admin/types/enum'

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
    const data = response.data.data
    if (data !== null || data !== undefined) {
      return data
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

export function timeRangeTransform<T extends object>(data: T, fields: (keyof T)[] | keyof T) {
  if (fields) {
    fields = Array.isArray(fields) ? fields : [fields]
  } else {
    fields = []
  }

  for (const field of fields) {
    const timeRange = _.get(data, field)
    if (timeRange && Array.isArray(timeRange)) {
      _.set(data, field, [dayjs(timeRange[0]).toISOString(), dayjs(timeRange[1]).toISOString()])
    }
  }

  return data
}
