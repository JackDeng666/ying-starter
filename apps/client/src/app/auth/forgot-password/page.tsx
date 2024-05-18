'use client'

import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { Button, Input } from '@nextui-org/react'

import { ForgotPasswordDto } from '@ying/shared'
import { FormError } from '@/client/components/form-error'
import { FormSuccess } from '@/client/components/form-success'
import { CardWrapper } from '../_components/card-wrapper'
import { useTranslate } from '@/client/i18n/client'
import { useApi } from '@/client/store/app-store'
import { ErrorRes } from '@/client/api/client/request'

const ForgotPasswordPage = () => {
  const { authApi } = useApi()
  const { t } = useTranslate('auth')
  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')

  const form = useForm<ForgotPasswordDto>({
    resolver: classValidatorResolver(ForgotPasswordDto),
    defaultValues: {
      email: ''
    }
  })
  const {
    register,
    formState: { errors, isSubmitting }
  } = form

  const onSubmit = async (values: ForgotPasswordDto) => {
    if (!authApi) return
    setError('')
    setSuccess('')

    try {
      await authApi.forgotPassword(values)
      setSuccess(t('success.password_reset_email_sent_successfully'))
    } catch (error) {
      setError(t((error as ErrorRes)?.message))
    }
  }

  return (
    <CardWrapper
      headerLabel={t('text.forgot_password')}
      backButtonLabel={t('text.back_to_login')}
      backButtonHref="/auth/login"
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Input
          variant="flat"
          label={t('text.email')}
          disabled={isSubmitting}
          placeholder={t('text.please_enter_email')}
          isClearable
          type="email"
          isInvalid={Boolean(errors.email)}
          errorMessage={t(errors.email?.message || '')}
          classNames={{
            innerWrapper: 'h-16',
            inputWrapper: 'h-16',
            label: 'text-base'
          }}
          {...register('email')}
        />
        <FormError message={error} />
        <FormSuccess message={success} />
        <Button color="primary" isLoading={isSubmitting} type="submit" className="w-full">
          {t('text.send_reset_email')}
        </Button>
      </form>
    </CardWrapper>
  )
}

export default ForgotPasswordPage
