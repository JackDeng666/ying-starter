/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly APP_ENV: 'dev' | 'test' | 'prod'
  readonly APP_API_BASE: string
  readonly APP_HOMEPAGE: string
  readonly APP_SERVER_URL: string
  readonly APP_DS_AIRDROP_ADDRESS?: `0x${string}`
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module 'virtual:svg-icons-register' {
  const content: string
  export default content
}
