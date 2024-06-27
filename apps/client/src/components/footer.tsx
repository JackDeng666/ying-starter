'use client'

import Link from 'next/link'

import { useTranslate } from '@/client/i18n/client'

import { MaxWidthWrapper } from './max-width-wrapper'
import { SwitchLanguage } from './switch-language'

export const Footer = () => {
  const { t } = useTranslate()

  return (
    <footer className="bg-white h-20 relative border-t">
      <MaxWidthWrapper>
        <div className="h-full flex flex-col md:flex-row md:justify-between justify-center items-center">
          <div className="flex items-center justify-center space-x-4 pb-2 md:pb-0">
            <div className="text-center md:text-left ">
              <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} All rights reserved</p>
            </div>
            <SwitchLanguage />
          </div>

          <div className="flex space-x-4 items-center">
            <Link href="#" className="text-sm text-muted-foreground hover:text-gray-600">
              {t('privacy_policy')}
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-gray-600">
              {t('cookie_policy')}
            </Link>
          </div>
        </div>
      </MaxWidthWrapper>
    </footer>
  )
}
