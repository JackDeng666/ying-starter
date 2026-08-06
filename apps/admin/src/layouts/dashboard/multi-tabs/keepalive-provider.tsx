import { PropsWithChildren } from 'react'
import { KeepaliveContext } from './keepalive-context'
import { useKeepAlive } from './use-keepalive'

export function KeepaliveProvider({ children }: PropsWithChildren) {
  const value = useKeepAlive()
  return <KeepaliveContext.Provider value={value}>{children}</KeepaliveContext.Provider>
}
