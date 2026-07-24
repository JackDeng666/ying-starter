import { useContext } from 'react'
import { LoginStateContext } from './login-state-context'

export function useLoginStateContext() {
  const context = useContext(LoginStateContext)
  if (!context) throw new Error('useLoginStateContext must be used within <LoginStateProvider/>')
  return context
}
