'use client'

import { usePathname } from '@/client/hooks/use-pathname'
import { useRouter } from '@/client/store/app-store'
import { cn } from '@/client/lib/utils'
import { useTranslate } from '@/client/i18n/client'
import { UserPages } from '@/client/routes'

export const Navbar = () => {
  const { t } = useTranslate('auth')
  const pathname = usePathname()
  const router = useRouter()

  return (
    <nav className="flex justify-between items-end p-4 pb-0 border-b">
      <div className="flex gap-x-4">
        {UserPages.map(el => (
          <div
            key={el.name}
            className={cn('text-center h-10 border-primary', pathname === el.link ? 'border-b-4' : 'border-b-0')}
          >
            <div
              className="cursor-pointer"
              onClick={() => {
                router.replace(el.link)
              }}
            >
              {t(el.name)}
            </div>
          </div>
        ))}
      </div>
    </nav>
  )
}
