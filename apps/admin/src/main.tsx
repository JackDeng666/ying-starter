import { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import 'virtual:svg-icons-register'
import App from '@/App'
import './theme/index.css'
import 'dayjs/locale/zh-cn'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <Suspense>
    <App />
  </Suspense>
)
