import { NavLink } from 'react-router-dom'

import { useThemeToken } from '@/admin/theme/hooks'

function Logo({ className = '' }: { className?: string }) {
  const { colorPrimary } = useThemeToken()

  return (
    <NavLink to="/" className="no-underline">
      <button className={`font-semibold ${className}`} style={{ color: colorPrimary }}>
        Ying
      </button>
    </NavLink>
  )
}

export default Logo
