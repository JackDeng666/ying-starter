import { NextRequest, NextResponse } from 'next/server'
import { ms } from '@ying/utils'
import { DefaultLoginRedirect, ProtectedRoutes, LoginPage } from './routes'
import { AppKey } from './enum'

export function middleware(request: NextRequest) {
  if (!process.env.AUTH_EXPIRES_IN) throw new Error('AUTH_EXPIRES_IN missing!')
  if (!process.env.AUTH_REFRESH_EXPIRES_IN) throw new Error('AUTH_REFRESH_EXPIRES_IN missing!')

  const { nextUrl, cookies, url } = request
  const { pathname, searchParams } = nextUrl

  const cookieAccessToken = cookies.get(AppKey.CookieAccessTokenKey)
  const cookieRefreshToken = cookies.get(AppKey.CookieRefreshTokenKey)
  const hasToken = cookieRefreshToken?.value

  const lng = searchParams.get(AppKey.QueryLanguageKey)
  if (lng) {
    searchParams.delete(AppKey.QueryLanguageKey)
    const response = NextResponse.redirect(nextUrl)
    response.cookies.set({
      name: AppKey.CookieLanguageKey,
      value: lng,
      path: '/'
    })
    return response
  }

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

  const isProtectedRoute = ProtectedRoutes.includes(nextUrl.pathname)
  if (!hasToken && isProtectedRoute) {
    return NextResponse.redirect(new URL(LoginPage, url))
  }

  if (hasToken && pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL(DefaultLoginRedirect, url))
  }
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)']
}
