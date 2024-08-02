import { NextRequest, NextResponse } from 'next/server'
import { ms } from '@ying/utils'
import { DefaultLoginRedirect, ProtectedRoutes, LoginPage, AllRoutes } from '@/client/routes'
import { AppKey } from '@/client/enum'
import { languagesWithSlashes } from '@/client/i18n/config'
import { getLocale } from '@/client/i18n/server'
import { pathMatchArr } from '@/client/lib/utils'

type TMatchData = {
  matchLng?: string
  matchRoute?: string
}

function languagesMiddleware(request: NextRequest, { matchLng, matchRoute }: TMatchData) {
  const { url } = request

  if (matchRoute) {
    if (!matchLng) {
      const lng = getLocale()
      return NextResponse.redirect(new URL(`/${lng}${matchRoute}`, url))
    }
  }
}

function authMiddleware(request: NextRequest, { matchLng }: TMatchData) {
  const { nextUrl, cookies, url } = request
  const { pathname, searchParams } = nextUrl

  const cookieAccessToken = cookies.get(AppKey.CookieAccessTokenKey)
  const cookieRefreshToken = cookies.get(AppKey.CookieRefreshTokenKey)
  const hasToken = cookieRefreshToken?.value

  // 传进了单点登录的回调地址
  const ssoCallback = searchParams.get(AppKey.QuerySSOCallbackKey)
  if (ssoCallback) {
    // 如果需要回调的地址不是子域，则需要回传token。
    if (process.env.DOMAIN && !new URL(ssoCallback).hostname.includes(process.env.DOMAIN) && hasToken) {
      const queryStr = `?${AppKey.QueryAccessTokenKey}=${cookieAccessToken?.value}&${AppKey.QueryRefreshTokenKey}=${cookieRefreshToken.value}`
      return NextResponse.redirect(`${ssoCallback}${queryStr}`)
    }

    // 没有token就先在cookie里保存一下回调地址
    searchParams.delete(AppKey.QuerySSOCallbackKey)
    const response = NextResponse.redirect(nextUrl)
    response.cookies.set({
      name: AppKey.CookieSSOCallbackKey,
      value: ssoCallback,
      path: '/'
    })
    return response
  }

  const cookieSSOCallback = cookies.get(AppKey.CookieSSOCallbackKey)
  if (cookieSSOCallback && hasToken) {
    let queryStr = ''
    // 如果需要回调的地址不是子域，则需要回传token。
    if (process.env.DOMAIN && !new URL(cookieSSOCallback.value).hostname.includes(process.env.DOMAIN)) {
      queryStr = `?${AppKey.QueryAccessTokenKey}=${cookieAccessToken?.value}&${AppKey.QueryRefreshTokenKey}=${cookieRefreshToken.value}`
    }
    const res = NextResponse.redirect(`${cookieSSOCallback.value}${queryStr}`)
    res.cookies.delete({ name: AppKey.CookieSSOCallbackKey })
    return res
  }

  const queryAccessToken = searchParams.get(AppKey.QueryAccessTokenKey)
  const queryRefreshToken = searchParams.get(AppKey.QueryRefreshTokenKey)
  if (queryAccessToken && queryRefreshToken) {
    if (!process.env.AUTH_EXPIRES_IN) throw new Error('AUTH_EXPIRES_IN missing!')
    if (!process.env.AUTH_REFRESH_EXPIRES_IN) throw new Error('AUTH_REFRESH_EXPIRES_IN missing!')

    const response = NextResponse.redirect(new URL(DefaultLoginRedirect, url))
    response.cookies.set({
      name: AppKey.CookieAccessTokenKey,
      value: queryAccessToken,
      domain: process.env.DOMAIN,
      maxAge: ms(process.env.AUTH_EXPIRES_IN) / 1000
    })
    response.cookies.set({
      name: AppKey.CookieRefreshTokenKey,
      value: queryRefreshToken,
      domain: process.env.DOMAIN,
      maxAge: ms(process.env.AUTH_REFRESH_EXPIRES_IN) / 1000
    })
    return response
  }

  const matchProtectedRoute = pathMatchArr(pathname, ProtectedRoutes, 'endsWith')

  if (!hasToken && matchProtectedRoute) {
    return NextResponse.redirect(new URL(`${matchLng}/${LoginPage}`, url))
  }

  if (hasToken && matchProtectedRoute?.startsWith('/auth')) {
    return NextResponse.redirect(new URL(`${matchLng}/${DefaultLoginRedirect}`, url))
  }
}

export function middleware(request: NextRequest) {
  const { nextUrl } = request
  const { pathname } = nextUrl

  const matchLng = pathMatchArr(pathname, languagesWithSlashes, 'startsWith')
  const matchRoute = pathMatchArr(pathname, AllRoutes, 'endsWith')

  const lngRes = languagesMiddleware(request, { matchLng, matchRoute })
  if (lngRes) return lngRes

  const authRes = authMiddleware(request, { matchLng, matchRoute })
  if (authRes) return authRes
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)']
}
