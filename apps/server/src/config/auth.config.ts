import { registerAs } from '@nestjs/config'

export const authConfig = registerAs('authConfig', () => {
  return {
    adminSecret: process.env.AUTH_ADMIN_SECRET,
    adminName: process.env.AUTH_ADMIN_NAME,
    adminPass: process.env.AUTH_ADMIN_PASS,
    adminExpiresIn: process.env.AUTH_ADMIN_EXPIRES_IN,
    secret: process.env.AUTH_SECRET,
    expiresIn: process.env.AUTH_EXPIRES_IN,
    redirectUrl: process.env.AUTH_REDIRECT_URL,
    githubId: process.env.AUTH_GITHUB_ID,
    githubSecret: process.env.AUTH_GITHUB_SECRET,
    googleId: process.env.AUTH_GOOGLE_ID,
    googleSecret: process.env.AUTH_GOOGLE_SECRET,
    facebookId: process.env.AUTH_FACEBOOK_ID,
    facebookSecret: process.env.AUTH_FACEBOOK_SECRET
  }
})
