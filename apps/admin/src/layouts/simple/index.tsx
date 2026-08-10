import { Outlet } from 'react-router-dom'
import { useThemeToken } from '@/hooks'
import { Logo } from '@/components/logo'
import { Settings } from '../_common/settings'

export default function SimpleLayout() {
  const { colorBgElevated, colorTextBase } = useThemeToken()

  return (
    <div
      className="flex h-screen w-full flex-col"
      style={{
        color: colorTextBase,
        background: colorBgElevated
      }}
    >
      <header className="flex h-16 w-full items-center justify-between px-6">
        <Logo />
        <Settings />
      </header>
      <Outlet />
    </div>
  )
}
