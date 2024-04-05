import { registerAs } from '@nestjs/config'

export const apiConfig = registerAs('apiConfig', () => {
  return {
    port: process.env.SERVER_PORT || 3000,
    url: process.env.SERVER_URL || 'http://localhost:3000'
  }
})
