import { NextRequest, NextResponse } from 'next/server'
import { ms } from '@ying/utils'
import { DefaultLoginRedirect, AuthRoutes, LoginPage } from '@/routes'
import { AppKey } from './enum'

export function middleware(request: NextRequest) {
  const { nextUrl, cookies, url } = request
  const { pathname, searchParams } = nextUrl

  const cookieToken = cookies.get(AppKey.CookieTokenKey)

  // 传进了单点登录的回调地址
  const ssoCallback = searchParams.get(AppKey.QuerySSOCallbackKey)
  if (ssoCallback) {
    let queryStr = ''
    // 如果需要回调的地址不是子域，则需要回传token。
    if (process.env.NEXT_PUBLIC_DOMAIN && !new URL(ssoCallback).hostname.includes(process.env.NEXT_PUBLIC_DOMAIN)) {
      queryStr = `?${AppKey.QueryTokenKey}=${cookieToken.value}`
    }
    if (cookieToken) {
      return NextResponse.redirect(`${ssoCallback}${queryStr}`)
    }
    // 没有token就先在cookie里保存一下回调地址
    searchParams.delete(AppKey.QuerySSOCallbackKey)
    const response = NextResponse.redirect(nextUrl)
    response.cookies.set({
      name: AppKey.CookieSSOCallbackKey,
      value: ssoCallback,
      path: '/',
      sameSite: 'strict'
    })
    return response
  }

  const cookieSSOCallback = cookies.get(AppKey.CookieSSOCallbackKey)
  if (cookieSSOCallback && cookieToken) {
    let queryStr = ''
    // 如果需要回调的地址不是子域，则需要回传token。
    if (
      process.env.NEXT_PUBLIC_DOMAIN &&
      !new URL(cookieSSOCallback.value).hostname.includes(process.env.NEXT_PUBLIC_DOMAIN)
    ) {
      queryStr = `?${AppKey.QueryTokenKey}=${cookieToken.value}`
    }
    const res = NextResponse.redirect(`${cookieSSOCallback.value}${queryStr}`)
    res.cookies.delete({ name: AppKey.CookieSSOCallbackKey })
    return res
  }

  const callbackToken = searchParams.get(AppKey.QueryTokenKey)
  if (callbackToken) {
    searchParams.delete(AppKey.QueryTokenKey)
    const response = NextResponse.redirect(nextUrl)
    response.cookies.set({
      name: AppKey.CookieTokenKey,
      value: callbackToken,
      domain: process.env.NEXT_PUBLIC_DOMAIN,
      sameSite: 'strict',
      maxAge: ms(process.env.NEXT_PUBLIC_AUTH_EXPIRES_IN!) / 1000
    })
    return response
  }

  const isAuthRoute = AuthRoutes.includes(nextUrl.pathname)
  if (!cookieToken && !isAuthRoute) {
    return NextResponse.redirect(new URL(LoginPage, url))
  }

  if (cookieToken && (pathname === '/' || isAuthRoute)) {
    return NextResponse.redirect(new URL(DefaultLoginRedirect, url))
  }
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)']
}
