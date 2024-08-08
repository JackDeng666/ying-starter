import { registerAs } from '@nestjs/config'

export const pushConfig = registerAs('pushConfig', () => {
  return {
    subject: process.env.VAPID_SUBJECT,
    publicKey: process.env.VAPID_PUBLIC_KEY,
    privateKey: process.env.VAPID_PRIVATE_KEY
  }
})
