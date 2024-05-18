'use client'

import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { Button, Input } from '@nextui-org/react'

import { NewPasswordDto } from '@ying/shared'

import { FormError } from '@/client/components/form-error'
import { FormSuccess } from '@/client/components/form-success'
import { useTranslate } from '@/client/i18n/client'
import { useApi } from '@/client/store/app-store'
import { ErrorRes } from '@/client/api/client/request'
import { CardWrapper } from '../_components/card-wrapper'

const NewPasswordPage = () => {
  const { authApi } = useApi()
  const { t } = useTranslate('auth')
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || undefined
  const email = searchParams.get('email') || undefined

  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')

  const form = useForm<NewPasswordDto>({
    resolver: classValidatorResolver(NewPasswordDto),
    defaultValues: {
      token,
      email,
      password: ''
    }
  })

  const {
    register,
    formState: { errors, isSubmitting }
  } = form

  const onSubmit = async (values: NewPasswordDto) => {
    if (!authApi) return
    setError('')
    setSuccess('')

    try {
      await authApi.newPassword(values)
      setSuccess(t('success.password_changed_successfully'))
    } catch (error) {
      setError(t((error as ErrorRes).message))
    }
  }

  return (
    <CardWrapper
      headerLabel={t('text.reset_password')}
      backButtonLabel={t('text.back_to_login')}
      backButtonHref="/auth/login"
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <Input
            variant="flat"
            label={t('text.new_password')}
            disabled={isSubmitting}
            placeholder={t('text.please_enter_new_password')}
            isClearable
            type="password"
            isInvalid={Boolean(errors.password)}
            errorMessage={t(errors.password?.message || '')}
            classNames={{
              innerWrapper: 'h-16',
              inputWrapper: 'h-16',
              label: 'text-base'
            }}
            {...register('password')}
          />
        </div>
        <FormError message={error} />
        <FormSuccess message={success} />
        <Button color="primary" isLoading={isSubmitting} type="submit" className="w-full">
          {t('text.reset_password')}
        </Button>
      </form>
    </CardWrapper>
  )
}

export default NewPasswordPage
