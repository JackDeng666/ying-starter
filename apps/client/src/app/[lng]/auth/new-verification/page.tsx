'use client'

import { useCallback, useEffect, useState } from 'react'
import { BeatLoader } from 'react-spinners'
import { useSearchParams } from 'next/navigation'

import { FormError } from '@/client/components/ui/form-error'
import { FormSuccess } from '@/client/components/ui/form-success'
import { useTranslate } from '@/client/i18n/client'
import { useApi } from '@/client/store/app-store'

import { CardWrapper } from '../_components/card-wrapper'

const NewVerificationPage = () => {
  const { authApi } = useApi()
  const { t } = useTranslate('auth')
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()

  const searchParams = useSearchParams()

  const token = searchParams.get('token') || ''
  const email = searchParams.get('email') || ''

  const onSubmit = useCallback(() => {
    if (success || error || !authApi) return

    authApi
      .newVerification({ token, email })
      .then(() => {
        setSuccess(t('success.email_verified_successfully'))
      })
      .catch(error => {
        setError(t(error.message))
      })
  }, [token, email, success, error, t, authApi])

  useEffect(() => {
    onSubmit()
  }, [onSubmit])

  if (!token) return null

  return (
    <CardWrapper
      headerLabel={t('text.confirm_your_verification')}
      backButtonLabel={t('text.back_to_login')}
      backButtonHref="/auth/login"
    >
      <div className="flex items-center w-full justify-center">
        {!success && !error && <BeatLoader />}
        <FormSuccess message={success} />
        {!success && <FormError message={error} />}
      </div>
    </CardWrapper>
  )
}

export default NewVerificationPage
