import { App as AntdApp } from 'antd'

import Router from '@/admin/router/index'
import AntdConfig from '@/admin/theme/antd'

import { MotionLazy } from './components/animate/motion-lazy'

function App() {
  return (
    <AntdConfig>
      <AntdApp>
        <MotionLazy>
          <Router />
        </MotionLazy>
      </AntdApp>
    </AntdConfig>
  )
}

export default App
