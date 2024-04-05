'use client'

import { ReactNode, createContext, useContext } from 'react'

type TAppContext = {
  apiUrl: string
}

export const AppContext = createContext<TAppContext>({
  apiUrl: ''
})

export const AppProvider = ({ children, value }: { children: ReactNode; value: TAppContext }) => {
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useAppContext = () => {
  return useContext(AppContext)
}
