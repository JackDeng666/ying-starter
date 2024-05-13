import { registerAs } from '@nestjs/config'

export const storageConfig = registerAs('storageConfig', () => {
  if (!process.env.MINIO_HOST) {
    throw new Error('MINIO_HOST is not exist')
  }
  if (!process.env.MINIO_BUCKET) {
    throw new Error('MINIO_BUCKET is not exist')
  }
  if (!process.env.MINIO_ACCESS_KEY) {
    throw new Error('MINIO_ACCESS_KEY is not exist')
  }
  if (!process.env.MINIO_SECRET_KEY) {
    throw new Error('MINIO_SECRET_KEY is not exist')
  }
  return {
    host: process.env.MINIO_HOST,
    port: +process.env.MINIO_PORT,
    bucket: process.env.MINIO_BUCKET,
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
    uploadthingSecret: process.env.UPLOADTHING_SECRET,
    uploadthingAppId: process.env.UPLOADTHING_APP_ID
  }
})
