'use client'

import { usePathname, useRouter } from 'next/navigation'
import { UserButton } from './user-button'
import { cn } from '@/lib/utils'
import { useTranslate } from '@/i18n/client'

export const Navbar = () => {
  const { t } = useTranslate()
  const pathname = usePathname()
  const router = useRouter()

  return (
    <nav className="flex justify-between items-end p-4 pb-0 shadow-sm">
      <div className="flex gap-x-4">
        <div className={cn(' text-center h-10 border-blue-500', pathname === '/profile' ? 'border-b-4' : 'border-b-0')}>
          <div
            className="cursor-pointer"
            onClick={() => {
              router.replace('/profile')
            }}
          >
            {t('Personal information')}
          </div>
        </div>
        <div
          className={cn(
            'text-center h-10 border-blue-500',
            pathname === '/reset-password' ? 'border-b-4' : 'border-b-0'
          )}
        >
          <div
            className="cursor-pointer"
            onClick={() => {
              router.replace('/reset-password')
            }}
          >
            {t('Reset password')}
          </div>
        </div>
      </div>
      <UserButton />
    </nav>
  )
}
