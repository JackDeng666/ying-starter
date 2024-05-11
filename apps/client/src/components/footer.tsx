'use client'

import Link from 'next/link'
import { useTranslate } from '@/client/i18n/client'
import { MaxWidthWrapper } from './max-width-wrapper'

export const Footer = () => {
  const { t } = useTranslate()

  return (
    <footer className="bg-white h-20 relative border-t-1">
      <MaxWidthWrapper>
        <div className="h-full flex flex-col md:flex-row md:justify-between justify-center items-center">
          <div className="text-center md:text-left pb-2 md:pb-0">
            <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} All rights reserved</p>
          </div>

          <div className="flex items-center justify-center">
            <div className="flex space-x-4">
              <Link href="#" className="text-sm text-muted-foreground hover:text-gray-600">
                {t('Terms')}
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-gray-600">
                {t('Privacy Policy')}
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-gray-600">
                {t('Cookie Policy')}
              </Link>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </footer>
  )
}
