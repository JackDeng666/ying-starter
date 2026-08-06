import { useLocation } from 'react-router-dom'

export function usePathname() {
  const { pathname } = useLocation()

  return pathname
}
