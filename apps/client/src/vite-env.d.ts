/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly APP_API_BASE: string
  readonly APP_SERVER_URL: string
  readonly APP_VAPID_PUBLIC_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
