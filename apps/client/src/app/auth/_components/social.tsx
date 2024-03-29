'use client'

import { FaGoogle, FaGithub, FaFacebook } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { AuthProvider, signIn } from '@/lib/sign-in'
import { useTranslate } from '@/i18n/client'

export const Social = () => {
  const { t } = useTranslate()

  const onClick = async (provider: AuthProvider) => {
    signIn({
      provider
    })
  }

  return (
    <div className="flex flex-col items-center w-full gap-y-2">
      <Button className="w-full flex gap-2" variant="outline" onClick={() => onClick('google')}>
        <FaGoogle className="h-5 w-5" />
        <span>{t('Google Login')}</span>
      </Button>
      <Button className="w-full flex gap-2" variant="outline" onClick={() => onClick('github')}>
        <FaGithub className="h-5 w-5" />
        <span>{t('Github Login')}</span>
      </Button>
      <Button className="w-full flex gap-2" variant="outline" onClick={() => onClick('facebook')}>
        <FaFacebook className="h-5 w-5" />
        <span>{t('Facebook Login')}</span>
      </Button>
    </div>
  )
}
