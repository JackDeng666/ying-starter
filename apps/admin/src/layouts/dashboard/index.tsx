import { Outlet } from 'react-router-dom'
import { useSettings } from '@/store'
import { useThemeToken } from '@/theme/hooks'
import { NavContextProvider, NavVertical, NavHorizontal } from './nav'
import { Header } from './header'
import { Main } from './main'
import { MultiTabs } from './multi-tabs'

export default function DashboardLayout() {
  const { colorBgElevated, colorTextBase, colorBgContainerDisabled } = useThemeToken()
  const { multiTab } = useSettings()

  return (
    <NavContextProvider>
      <div
        className="flex h-screen w-screen overflow-hidden relative"
        style={{
          color: colorTextBase,
          background: colorBgElevated,
          transition: 'color 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, background 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'
        }}
      >
        <NavVertical />
        <div className="flex-auto flex flex-col overflow-auto">
          <Header />
          <NavHorizontal />
          <div
            className="w-full flex-auto overflow-auto"
            style={{
              backgroundColor: colorBgContainerDisabled
            }}
          >
            {multiTab ? (
              <MultiTabs />
            ) : (
              <Main>
                <Outlet />
              </Main>
            )}
          </div>
        </div>
      </div>
    </NavContextProvider>
  )
}
