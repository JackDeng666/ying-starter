import { registerAs } from '@nestjs/config'

export const apiConfig = registerAs('apiConfig', () => {
  if (!process.env.APP_ENV) throw new Error('APP_ENV is not exist')

  const port = process.env.SERVER_PORT ?? 3000
  return {
    appEnv: process.env.APP_ENV as 'dev' | 'test' | 'prod',
    port,
    serverUrl: process.env.SERVER_URL ?? `http://localhost:${port}`
  }
})
