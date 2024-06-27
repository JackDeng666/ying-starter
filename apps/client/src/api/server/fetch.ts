import { cookies, headers } from 'next/headers'
import { AppKey } from '@/client/enum'
import { defaultLocale } from '@/client/i18n/config'

const getHeaders = () => {
  const headersOb = {}

  const customLng = cookies().get(AppKey.CookieLanguageKey)?.value
  if (customLng) {
    headersOb['custom-lng'] = customLng
  }

  return Object.assign(headersOb, {
    'accept-language': headers().get('accept-language') || defaultLocale
  })
}

export const serverFetch = async (url: string | URL | globalThis.Request, init?: RequestInit) => {
  try {
    const requestInit = { ...init }
    requestInit.headers = Object.assign(getHeaders(), requestInit.headers)
    const res = await fetch(url, requestInit)
    return await res.json()
  } catch (error) {
    return {
      status: 500,
      message: 'Something went wrong!',
      timestamp: new Date(),
      path: url.toString()
    }
  }
}
