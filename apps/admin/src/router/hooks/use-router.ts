import { useNavigate, type NavigateOptions } from 'react-router-dom'

export function useRouter() {
  const navigate = useNavigate()
  return {
    back: () => navigate(-1),
    forward: () => navigate(1),
    reload: () => window.location.reload(),
    push: (href: string, options?: NavigateOptions) => navigate(href, options),
    replace: (href: string, options?: NavigateOptions) => navigate(href, { replace: true, ...options })
  }
}
