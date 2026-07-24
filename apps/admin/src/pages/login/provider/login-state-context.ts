import { createContext } from 'react'

export enum LoginStateEnum {
  LOGIN,
  REGISTER,
  RESET_PASSWORD,
  MOBILE,
  QR_CODE
}

export type LoginStateContextValue = {
  loginState: LoginStateEnum
  setLoginState: (loginState: LoginStateEnum) => void
  backToLogin: () => void
}
export const LoginStateContext = createContext<LoginStateContextValue | undefined>(undefined)
