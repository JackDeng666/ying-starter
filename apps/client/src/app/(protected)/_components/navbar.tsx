'use client'

import { usePathname } from 'next/navigation'
import { useRouter } from '@/client/store/app-store'
import { cn } from '@/client/lib/utils'
import { useTranslate } from '@/client/i18n/client'

export const Navbar = () => {
  const { t } = useTranslate('auth')
  const pathname = usePathname()
  const router = useRouter()

  return (
    <nav className="flex justify-between items-end p-4 pb-0 border-b">
      <div className="flex gap-x-4">
        <div className={cn('text-center h-10 border-primary', pathname === '/profile' ? 'border-b-4' : 'border-b-0')}>
          <div
            className="cursor-pointer"
            onClick={() => {
              router.replace('/profile')
            }}
          >
            {t('text.personal_information')}
          </div>
        </div>
        <div
          className={cn(
            'text-center h-10 border-primary',
            pathname === '/reset-password' ? 'border-b-4' : 'border-b-0'
          )}
        >
          <div
            className="cursor-pointer"
            onClick={() => {
              router.replace('/reset-password')
            }}
          >
            {t('text.reset_password')}
          </div>
        </div>
      </div>
    </nav>
  )
}
