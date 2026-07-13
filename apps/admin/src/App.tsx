import { App as AntdApp } from 'antd'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import Router from '@/router/index'
import AntdConfig from '@/theme/antd'

import { MotionLazy } from './components/animate/motion-lazy'

import { DevModal } from './layouts/dev/dev-modal'
import { RouteLoadingProgress } from './components/route-loading'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AntdConfig>
        <AntdApp>
          <MotionLazy>
            <RouteLoadingProgress />
            <DevModal />
            <Router />
          </MotionLazy>
        </AntdApp>
      </AntdConfig>
    </QueryClientProvider>
  )
}
