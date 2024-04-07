'use client'

import { useCallback, useEffect, useState } from 'react'
import { BeatLoader } from 'react-spinners'
import { useSearchParams } from 'next/navigation'

import { FormError } from '@/components/form-error'
import { FormSuccess } from '@/components/form-success'
import { CardWrapper } from '../_components/card-wrapper'
import { useTranslate } from '@/i18n/client'
import { useApi } from '@/store/api-store'

const NewVerificationPage = () => {
  const { authApi } = useApi()
  const { t } = useTranslate()
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()

  const searchParams = useSearchParams()

  const token = searchParams.get('token')
  const email = searchParams.get('email')

  const onSubmit = useCallback(() => {
    if (success || error || !authApi) return

    authApi
      .newVerification({ token, email })
      .then(() => {
        setSuccess(t('Email verified successfully!'))
      })
      .catch(error => {
        setError(t(error.message, { ns: 'backend' }))
      })
  }, [token, email, success, error, t, authApi])

  useEffect(() => {
    onSubmit()
  }, [onSubmit])

  if (!token) return null

  return (
    <CardWrapper
      headerLabel={t('Confirm your verification')}
      backButtonLabel={t('Back to login')}
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
