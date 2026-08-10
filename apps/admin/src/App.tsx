import { App as AntdApp } from 'antd'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import Router from '@/router/index'
import AntdConfig from '@/theme'

import { MotionLazy } from './components/animate/motion-lazy'

import { DevDrawer } from './layouts/dev/dev-drawer'
import { RouteLoadingProgress } from './components/route-loading'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AntdConfig>
        <AntdApp>
          <MotionLazy>
            <RouteLoadingProgress />
            <DevDrawer />
            <Router />
          </MotionLazy>
        </AntdApp>
      </AntdConfig>
    </QueryClientProvider>
  )
}
