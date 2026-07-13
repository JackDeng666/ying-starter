import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type VisitorStore = {
  hasHydrated: boolean
  visitorId?: string
}

export const useVisitorStore = create<VisitorStore>()(
  persist(
    _ => ({
      hasHydrated: false,
      visitorId: undefined
    }),
    {
      name: 'visitor_store',
      onRehydrateStorage: _ => state => {
        state && (state.hasHydrated = true)
      }
    }
  )
)
