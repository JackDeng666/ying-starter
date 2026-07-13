import { registerAs } from '@nestjs/config'

export const authConfig = registerAs('authConfig', () => {
  if (!process.env.AUTH_ADMIN_ACCESS_TOKEN_SECRET) throw new Error('AUTH_ADMIN_ACCESS_TOKEN_SECRET is not exist')
  if (!process.env.AUTH_ADMIN_ACCESS_TOKEN_EXPIRES_IN)
    throw new Error('AUTH_ADMIN_ACCESS_TOKEN_EXPIRES_IN is not exist')
  if (!process.env.AUTH_ADMIN_REFRESH_TOKEN_SECRET) throw new Error('AUTH_ADMIN_REFRESH_TOKEN_SECRET is not exist')
  if (!process.env.AUTH_ADMIN_REFRESH_TOKEN_EXPIRES_IN)
    throw new Error('AUTH_ADMIN_REFRESH_TOKEN_EXPIRES_IN is not exist')

  if (!process.env.AUTH_CLIENT_ACCESS_TOKEN_SECRET) throw new Error('AUTH_CLIENT_ACCESS_TOKEN_SECRET is not exist')
  if (!process.env.AUTH_CLIENT_ACCESS_TOKEN_EXPIRES_IN)
    throw new Error('AUTH_CLIENT_ACCESS_TOKEN_EXPIRES_IN is not exist')
  if (!process.env.AUTH_CLIENT_REFRESH_TOKEN_SECRET) throw new Error('AUTH_CLIENT_REFRESH_TOKEN_SECRET is not exist')
  if (!process.env.AUTH_CLIENT_REFRESH_TOKEN_EXPIRES_IN)
    throw new Error('AUTH_CLIENT_REFRESH_TOKEN_EXPIRES_IN is not exist')

  return {
    adminAccessTokenSecret: process.env.AUTH_ADMIN_ACCESS_TOKEN_SECRET,
    adminAccessTokenExpiresIn: process.env.AUTH_ADMIN_ACCESS_TOKEN_EXPIRES_IN,
    adminRefreshTokenSecret: process.env.AUTH_ADMIN_REFRESH_TOKEN_SECRET,
    adminRefreshTokenExpiresIn: process.env.AUTH_ADMIN_REFRESH_TOKEN_EXPIRES_IN,

    clientAccessTokenSecret: process.env.AUTH_CLIENT_ACCESS_TOKEN_SECRET,
    clientAccessTokenExpiresIn: process.env.AUTH_CLIENT_ACCESS_TOKEN_EXPIRES_IN,
    clientRefreshTokenSecret: process.env.AUTH_CLIENT_REFRESH_TOKEN_SECRET,
    clientRefreshTokenExpiresIn: process.env.AUTH_CLIENT_REFRESH_TOKEN_EXPIRES_IN,

    googleId: process.env.AUTH_GOOGLE_ID,
    googleSecret: process.env.AUTH_GOOGLE_SECRET,
    githubId: process.env.AUTH_GITHUB_ID,
    githubSecret: process.env.AUTH_GITHUB_SECRET,
    authClientUrl: process.env.AUTH_CLIENT_URL,
    oauthCallbackBaseUrl: process.env.OAUTH_CALLBACK_BASE_URL
  }
})
