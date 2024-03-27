import { registerAs } from '@nestjs/config'

export const mailConfig = registerAs('mailConfig', () => {
  if (!process.env.MAIL_HOST) {
    throw new Error('MAIl_HOST is not exist')
  }
  if (!process.env.MAIL_PORT) {
    throw new Error('MAIL_PORT is not exist')
  }
  if (!process.env.MAIL_USER) {
    throw new Error('MAIL_USER is not exist')
  }
  if (!process.env.MAIL_AUTH_CODE) {
    throw new Error('MAIL_AUTH_CODE is not exist')
  }
  return {
    host: process.env.MAIL_HOST,
    port: +process.env.MAIL_PORT,
    user: process.env.MAIL_USER,
    code: process.env.MAIL_AUTH_CODE
  }
})
