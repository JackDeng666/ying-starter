import { createContext } from 'react'
import { useKeepAlive } from './use-keepalive'

export type KeepaliveContextValue = ReturnType<typeof useKeepAlive>
export const KeepaliveContext = createContext<KeepaliveContextValue | undefined>(undefined)
