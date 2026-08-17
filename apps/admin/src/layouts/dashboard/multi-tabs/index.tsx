import type { PropsWithClassName } from '@/types'
import { KeepaliveProvider } from './keepalive-provider'
import { SortableTabs } from './sortable-tabs'

export function MultiTabs({ className }: PropsWithClassName) {
  return (
    <KeepaliveProvider>
      <SortableTabs className={className} />
    </KeepaliveProvider>
  )
}
