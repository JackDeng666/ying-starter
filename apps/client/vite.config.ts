import { defineConfig, loadEnv } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { devtools } from '@tanstack/devtools-vite'
import viteReact, { reactCompilerPreset } from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import babel from '@rolldown/plugin-babel'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'APP_')
  return {
    envPrefix: 'APP_',
    resolve: { tsconfigPaths: true },
    server: {
      host: true,
      // allowedHosts: ['unpainted-catwalk-headache.ngrok-free.dev'],
      proxy: {
        '/api': {
          target: env.APP_SERVER_URL
        },
        '/socket.io': {
          target: env.APP_SERVER_URL,
          ws: true
        }
      }
    },
    plugins: [
      tanstackStart(),
      devtools({
        consolePiping: {
          enabled: false
        }
      }),
      viteReact(),
      babel({ presets: [reactCompilerPreset()] }),
      tailwindcss()
    ]
  }
})
