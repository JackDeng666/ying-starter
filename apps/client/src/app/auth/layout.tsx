import { Suspense } from 'react'
import { LayoutProps } from '@/client/types'

const AuthLayout = ({ children }: LayoutProps) => {
  return (
    <div className="h-full flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
      <Suspense>{children}</Suspense>
    </div>
  )
}

export default AuthLayout
