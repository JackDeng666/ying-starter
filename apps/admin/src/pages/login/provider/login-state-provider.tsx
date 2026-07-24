import { PropsWithChildren, useMemo, useState } from 'react'
import { LoginStateEnum, LoginStateContext, type LoginStateContextValue } from './login-state-context'

export function LoginStateProvider({ children }: PropsWithChildren) {
  const [loginState, setLoginState] = useState(LoginStateEnum.LOGIN)

  function backToLogin() {
    setLoginState(LoginStateEnum.LOGIN)
  }

  const value: LoginStateContextValue = useMemo(() => ({ loginState, setLoginState, backToLogin }), [loginState])
  return <LoginStateContext.Provider value={value}>{children}</LoginStateContext.Provider>
}
