import { defineConfig } from 'vite'

export default defineConfig({
  envPrefix: 'APP_',
  build: {
    outDir: 'public',
    emptyOutDir: false, // 避免清空 public
    lib: {
      entry: 'sw/notification-sw.ts',
      formats: ['es'],
      fileName: () => 'notification-sw.js'
    }
  }
})
