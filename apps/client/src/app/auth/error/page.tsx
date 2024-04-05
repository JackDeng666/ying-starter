'use client'

import { useSearchParams } from 'next/navigation'
import { CardWrapper } from '../_components/card-wrapper'
import { useTranslate } from '@/i18n/client'
import { FormError } from '@/components/form-error'

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
      <FormError message={msg} />
    </CardWrapper>
  )
}

export default AuthErrorPage
