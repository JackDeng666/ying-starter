import { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import '@ant-design/v5-patch-for-react-19'
import 'virtual:svg-icons-register'
import 'dayjs/locale/zh-cn'

import './styles.css'
import App from './App'

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <Suspense>
    <App />
  </Suspense>
)
