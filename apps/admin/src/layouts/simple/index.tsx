import { Outlet } from 'react-router-dom'
import { useThemeToken } from '@/hooks'
import HeaderSimple from '../_common/header-simple'

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
      <HeaderSimple />
      <Outlet />
    </div>
  )
}
