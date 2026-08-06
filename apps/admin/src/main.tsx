import { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
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
