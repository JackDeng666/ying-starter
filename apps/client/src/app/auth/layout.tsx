import { LayoutProps } from '@/client/types'

const AuthLayout = ({ children }: LayoutProps) => {
  return <div className="flex-1 flex flex-col items-center justify-center">{children}</div>
}

export default AuthLayout
