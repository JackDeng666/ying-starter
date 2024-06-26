'use client'

import { FaGoogle, FaGithub, FaFacebook } from 'react-icons/fa'
import { Button } from '@/client/components/ui/button'
import { useTranslate } from '@/client/i18n/client'
import { AuthProvider, useSignIn } from '@/client/hooks/use-sign-in'

export const Social = () => {
  const { t } = useTranslate('auth')
  const signIn = useSignIn()

  const onClick = async (provider: AuthProvider) => {
    signIn({
      provider
    })
  }

  return (
    <div className="flex flex-col items-center w-full gap-y-2">
      <Button className="w-full flex gap-2" variant="outline" onClick={() => onClick('google')}>
        <FaGoogle className="h-5 w-5" />
        <span>{t('text.google_login')}</span>
      </Button>
      <Button className="w-full flex gap-2" variant="outline" onClick={() => onClick('github')}>
        <FaGithub className="h-5 w-5" />
        <span>{t('text.github_login')}</span>
      </Button>
      <Button className="w-full flex gap-2" variant="outline" onClick={() => onClick('facebook')}>
        <FaFacebook className="h-5 w-5" />
        <span>{t('text.facebook_login')}</span>
      </Button>
    </div>
  )
}
