'use client'

import { Button } from '@nextui-org/react'
import { FaGoogle, FaGithub, FaFacebook } from 'react-icons/fa'
import { useTranslate } from '@/i18n/client'
import { AuthProvider, useSignIn } from '@/hooks/use-sign-in'

export const Social = () => {
  const { t } = useTranslate()
  const signIn = useSignIn()

  const onClick = async (provider: AuthProvider) => {
    signIn({
      provider
    })
  }

  return (
    <div className="flex flex-col items-center w-full gap-y-2">
      <Button className="w-full flex gap-2" variant="bordered" onClick={() => onClick('google')}>
        <FaGoogle className="h-5 w-5" />
        <span>{t('Google Login')}</span>
      </Button>
      <Button className="w-full flex gap-2" variant="bordered" onClick={() => onClick('github')}>
        <FaGithub className="h-5 w-5" />
        <span>{t('Github Login')}</span>
      </Button>
      <Button className="w-full flex gap-2" variant="bordered" onClick={() => onClick('facebook')}>
        <FaFacebook className="h-5 w-5" />
        <span>{t('Facebook Login')}</span>
      </Button>
    </div>
  )
}
