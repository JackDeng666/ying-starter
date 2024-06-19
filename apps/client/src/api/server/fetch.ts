import { cookies, headers } from 'next/headers'
import { AppKey } from '@/client/enum'

const getHeaders = () => {
  const headersOb = {}

  return Object.assign(headersOb, {
    'accept-language': headers().get('accept-language'),
    'custom-lng': cookies().get(AppKey.CookieLanguageKey)?.value,
    authorization: `Bearer ${cookies().get(AppKey.CookieAccessTokenKey)}`
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
