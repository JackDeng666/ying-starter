import type { Request } from 'express'

export function parseAuthHeader(headerValue: string) {
  if (typeof headerValue !== 'string') {
    return null
  }
  const matches = headerValue.match(/(\S+)\s+(\S+)/)
  return matches && { scheme: matches[1], value: matches[2] }
}

export function getTokenFromRequest(request: Request) {
  let token: string | undefined
  const authorization = request.headers['authorization']
  if (authorization) {
    const authParams = parseAuthHeader(authorization)
    if (authParams && 'bearer' === authParams.scheme.toLowerCase()) {
      token = authParams.value
    }
  }
  return token
}
