import { useContext } from 'react'
import { KeepaliveContext } from './keepalive-context'

export function useKeepaliveContext() {
  const context = useContext(KeepaliveContext)
  if (!context) throw new Error('useKeepaliveContext must be used within <KeepaliveProvider/>')
  return context
}
