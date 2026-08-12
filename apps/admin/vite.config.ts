import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import babel from '@rolldown/plugin-babel'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { customLogger } from './vite.logger'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'APP_')
  return {
    envPrefix: 'APP_',
    resolve: { tsconfigPaths: true },
    server: {
      host: true,
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
    customLogger,
    plugins: [
      babel({ presets: [reactCompilerPreset()] }),
      react(),
      tailwindcss(),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(__dirname, 'src/assets/icons')], // 指定需要缓存的图标文件夹
        symbolId: 'ic-[dir]-[name]' // 指定symbolId格式
      })
    ]
  }
})
