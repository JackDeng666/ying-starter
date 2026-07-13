import { Navigate } from 'react-router-dom'
import { useThemeToken } from '@/theme/hooks'
import PlaceholderImg from '@/assets/images/background/placeholder.svg'
import { useUserInfo, useAuthTokens } from '@/store'
import LoginForm from './LoginForm'
import { LoginStateProvider } from './providers/LoginStateProvider'

const { APP_HOMEPAGE: HOMEPAGE } = import.meta.env

function Login() {
  const token = useThemeToken()
  const authTokens = useAuthTokens()
  const userInfo = useUserInfo()

  if (authTokens.accessToken && userInfo.id) {
    return <Navigate to={HOMEPAGE} replace />
  }

  return (
    <div className="relative grid min-h-svh lg:grid-cols-2" style={{ backgroundColor: token.colorBgContainer }}>
      <div className="relative hidden lg:block">
        <img
          src={PlaceholderImg}
          alt="placeholder img"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.5] dark:grayscale"
        />
      </div>

      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <div className="flex items-center gap-2 font-medium cursor-pointer">
            {/* <img className="w-[30px]" src={LogoImg} alt="logo" /> */}
            <span>Ying</span>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginStateProvider>
              <LoginForm />
            </LoginStateProvider>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Login
