import { NavLink } from 'react-router-dom'

import LogoImg from '@/assets/images/logo.png'
import { useThemeToken } from '@/theme/hooks'

import { cn } from '@ying/frontend/ui'

type LogoProps = {
  className?: string
  showName?: boolean
}
function Logo({ className, showName = true }: LogoProps) {
  const { colorPrimary } = useThemeToken()

  return (
    <NavLink to="/" className="no-underline flex items-center gap-x-1">
      <img className="w-14 h-14" src={LogoImg} alt="logo" />
      {showName && (
        <button className={cn('font-semibold', className)} style={{ color: colorPrimary }}>
          Ying
        </button>
      )}
    </NavLink>
  )
}

export default Logo
