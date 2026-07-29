import type { Request } from 'express'

export function parseAuthHeader(headerValue: string) {
  if (typeof headerValue !== 'string') {
    return null
  }
  const matches = headerValue.match(/(\S+)\s+(\S+)/)
  return matches && { scheme: matches[1], value: matches[2] }
}

export function getTokenFromHeaders(headers: Request['headers']) {
  let token: string | undefined
  const authorization = headers['authorization']
  if (authorization) {
    const authParams = parseAuthHeader(authorization)
    if (authParams && 'bearer' === authParams.scheme.toLowerCase()) {
      token = authParams.value
    }
  }
  return token
}

export function getTokenFromRequest(request: Request) {
  const cookies = request.cookies as TCookies | undefined
  return getTokenFromHeaders(request.headers) ?? cookies?.accessToken
}

export function getRefreshTokenFromRequest(request: Request) {
  const cookies = request.cookies as TCookies | undefined
  return (request.headers['refreshToken'] as string | undefined) ?? cookies?.refreshToken
}
