'use client'

import { ReactNode, createContext, useContext } from 'react'

export type TAppContext = {
  apiUrl: string
  domain: string
  accessTokenExpiresIn: string
  refreshTokenExpiresIn: string
  lng: string
}

export const AppContext = createContext<TAppContext>({
  apiUrl: '',
  domain: '',
  accessTokenExpiresIn: '',
  refreshTokenExpiresIn: '',
  lng: ''
})

export const AppProvider = ({ children, value }: { children: ReactNode; value: TAppContext }) => {
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useAppContext = () => {
  return useContext(AppContext)
}
