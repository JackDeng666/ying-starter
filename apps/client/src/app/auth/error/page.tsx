'use client'

import { useSearchParams } from 'next/navigation'
import { CardWrapper } from '../_components/card-wrapper'
import { useTranslate } from '@/client/i18n/client'
import { FormError } from '@/client/components/ui/form-error'

const AuthErrorPage = () => {
  const { t } = useTranslate('auth')
  const { t: tB } = useTranslate('basic')
  const searcheParams = useSearchParams()
  const msg = searcheParams.get('msg')

  return (
    <CardWrapper
      headerLabel={tB('something_went_wrong')}
      backButtonHref="/auth/login"
      backButtonLabel={t('text.back_to_login')}
    >
      <FormError message={msg} />
    </CardWrapper>
  )
}

export default AuthErrorPage
