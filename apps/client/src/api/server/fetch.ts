import { cookies, headers } from 'next/headers'
import { AppKey } from '@/client/enum'
import { fallbackLng } from '@/client/i18n/config'
import { ResOrError } from './type'

export const API_URL = process.env.SERVER_URL_INTERNAL + '/api/client'

const getHeaders = () => {
  const headersOb = {}

  const customLng = cookies().get(AppKey.CookieLanguageKey)?.value
  if (customLng) {
    headersOb['lng'] = customLng
  }

  return Object.assign(headersOb, {
    'accept-language': headers().get('accept-language') || fallbackLng
  })
}

export const serverFetch = async <T>(
  url: string | URL | globalThis.Request,
  init?: RequestInit
): Promise<ResOrError<T>> => {
  try {
    const requestInit = { ...init }
    requestInit.headers = Object.assign(getHeaders(), requestInit.headers)
    let fetchUrl = url
    if (typeof fetchUrl === 'string') {
      fetchUrl = `${API_URL}${fetchUrl}`
    }
    const res = await fetch(fetchUrl, requestInit)
    return await res.json()
  } catch (error) {
    return {
      status: 500,
      message: 'Something went wrong!',
      timestamp: new Date().toString(),
      path: url.toString()
    }
  }
}
