'use client'

import { useParams } from 'next/navigation'
import { ReactNode, createContext, useContext } from 'react'
import { initI18n } from '@/client/i18n/client'
import { useNotificationSw } from '@/client/hooks/use-notification-sw'
import { useVisitor } from '@/client/store/visitor-store'

export type TAppContext = {
  serverUrl: string
  domain: string
  accessTokenExpiresIn: string
  refreshTokenExpiresIn: string
  pageSpyUrl?: string
  pageSpyProject?: string
  vapidPublicKey?: string
}

export const AppContext = createContext<TAppContext>({
  serverUrl: '',
  domain: '',
  accessTokenExpiresIn: '',
  refreshTokenExpiresIn: ''
})

const AppInitProvider = ({ children }: { children: ReactNode }) => {
  const { lng } = useParams()
  initI18n(lng as string)

  useVisitor()
  useNotificationSw()

  return children
}

export const AppProvider = ({ children, value }: { children: ReactNode; value: TAppContext }) => {
  return (
    <AppContext.Provider value={value}>
      <AppInitProvider>{children}</AppInitProvider>
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  return useContext(AppContext)
}
