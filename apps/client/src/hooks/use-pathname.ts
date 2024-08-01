import { useParams, usePathname as useNextPathname } from 'next/navigation'
import { useMemo } from 'react'

export const usePathname = () => {
  const { lng } = useParams()
  const nextPathname = useNextPathname()

  const pathname = useMemo(() => {
    if (lng) {
      const replacePathname = nextPathname.replace(`/${lng}`, '')
      if (!replacePathname) return '/'
      return replacePathname
    }
    return nextPathname
  }, [nextPathname, lng])
  return pathname
}
