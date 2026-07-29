import { registerAs } from '@nestjs/config'

export const apiConfig = registerAs('apiConfig', () => {
  const port = process.env.SERVER_PORT ?? 3000
  return {
    port,
    serverUrl: process.env.SERVER_URL ?? `http://localhost:${port}`
  }
})
