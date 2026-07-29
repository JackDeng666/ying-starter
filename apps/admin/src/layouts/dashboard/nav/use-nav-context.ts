import { useContext } from 'react'
import { NavContext } from './nav-context'

export const useNavContext = () => {
  const context = useContext(NavContext)
  if (!context) throw new Error('useNavContext must be used within <NavContextProvider/>')
  return context
}
