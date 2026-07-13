import { NavLink } from 'react-router-dom'

import LogoImg from '@/assets/images/logo.png'
import { useThemeToken } from '@/theme/hooks'
import { useSettings } from '@/store'
import { ThemeLayout } from '@/types/enum'
import { cn } from '@ying/frontend/ui'

function Logo({ className }: { className?: string }) {
  const { themeLayout } = useSettings()
  const { colorPrimary } = useThemeToken()

  return (
    <NavLink to="/" className="no-underline flex items-center gap-x-1">
      <img className="w-14 h-14" src={LogoImg} alt="logo" />
      {themeLayout !== ThemeLayout.Mini && (
        <button className={cn('font-semibold', className)} style={{ color: colorPrimary }}>
          Ying
        </button>
      )}
    </NavLink>
  )
}

export default Logo
