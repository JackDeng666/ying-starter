'use client'

import { useParams } from 'next/navigation'
import { ReactNode, createContext, useContext } from 'react'
import { initI18n } from '@/client/i18n/client'

export type TAppContext = {
  serverUrl: string
  domain: string
  accessTokenExpiresIn: string
  refreshTokenExpiresIn: string
  pageSpyUrl?: string
  pageSpyProject?: string
}

export const AppContext = createContext<TAppContext>({
  serverUrl: '',
  domain: '',
  accessTokenExpiresIn: '',
  refreshTokenExpiresIn: '',
  pageSpyUrl: '',
  pageSpyProject: ''
})

export const AppProvider = ({ children, value }: { children: ReactNode; value: TAppContext }) => {
  const { lng } = useParams()
  initI18n(lng as string)
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useAppContext = () => {
  return useContext(AppContext)
}
