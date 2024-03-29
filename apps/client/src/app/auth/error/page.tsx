'use client'

import { useSearchParams } from 'next/navigation'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { CardWrapper } from '../_components/card-wrapper'
import { useTranslate } from '@/i18n/client'

const AuthErrorPage = () => {
  const { t } = useTranslate()
  const searcheParams = useSearchParams()
  const msg = searcheParams.get('msg')

  return (
    <CardWrapper
      headerLabel={t('Something went wrong!')}
      backButtonHref="/auth/login"
      backButtonLabel={t('Back to login')}
    >
      <div className="w-full flex justify-center items-center gap-2 text-destructive">
        <ExclamationTriangleIcon className="text-destructive" />
        {msg}
      </div>
    </CardWrapper>
  )
}

export default AuthErrorPage
