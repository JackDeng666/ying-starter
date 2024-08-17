import { useMemo } from 'react'
import { useNavigate, NavigateOptions } from 'react-router-dom'

export function useRouter() {
  const navigate = useNavigate()

  const router = useMemo(
    () => ({
      back: () => navigate(-1),
      forward: () => navigate(1),
      reload: () => window.location.reload(),
      push: (href: string, options?: NavigateOptions) => navigate(href, options),
      replace: (href: string, options?: NavigateOptions) => navigate(href, { replace: true, ...options })
    }),
    [navigate]
  )

  return router
}
