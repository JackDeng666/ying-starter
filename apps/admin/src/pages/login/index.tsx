import { Navigate } from 'react-router-dom'
import { useThemeToken } from '@/hooks'
import { Logo } from '@/components/logo'
import PlaceholderSVG from '@/assets/images/background/placeholder.svg?react'
import { useUserInfo, useAccessToken } from '@/store'
import { LoginForm } from './login-form'
import { LoginStateProvider } from './provider'

const { APP_HOMEPAGE: HOMEPAGE } = import.meta.env

function Login() {
  const { colorBgLayout } = useThemeToken()
  const accessToken = useAccessToken()
  const userInfo = useUserInfo()

  if (accessToken && userInfo?.id) {
    return <Navigate to={HOMEPAGE} replace />
  }

  return (
    <div className="h-svh flex" style={{ backgroundColor: colorBgLayout }}>
      <PlaceholderSVG
        viewBox="0 0 1200 1200"
        preserveAspectRatio="xMidYMid slice"
        className="flex-1 h-full w-full hidden lg:block dark:brightness-[0.3]"
      />

      <div className="flex-1 flex flex-col gap-4 p-6 md:p-10 object-cover">
        <Logo className="text-3xl" />
        <div className="flex-1 fc">
          <LoginStateProvider>
            <LoginForm />
          </LoginStateProvider>
        </div>
      </div>
    </div>
  )
}
export default Login
