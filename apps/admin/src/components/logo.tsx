import { CSSProperties } from 'react'
import { NavLink } from 'react-router-dom'
import { cn } from '@ying/frontend/ui'
import LogoImg from '@/assets/images/logo.png'
import { useThemeToken } from '@/hooks'

type LogoProps = {
  className?: string
  showName?: boolean
  style?: CSSProperties
}
export function Logo({ className, showName = true, style }: LogoProps) {
  const { colorPrimary } = useThemeToken()

  return (
    <NavLink to="/" className={cn('no-underline flex items-center gap-x-0.75', className)} style={style}>
      <img className="w-12 h-12" src={LogoImg} alt="logo" />
      {showName && (
        <span className="font-semibold" style={{ color: colorPrimary }}>
          Ying
        </span>
      )}
    </NavLink>
  )
}
