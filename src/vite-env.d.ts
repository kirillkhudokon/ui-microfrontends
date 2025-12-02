/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLOUDFRONT_URL: string
  readonly VITE_REMOTE_ENTRY_URL: string
  readonly VITE_ENV: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
