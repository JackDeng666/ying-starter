'use client'

import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { Button, Input } from '@nextui-org/react'

import { NewPasswordDto } from '@ying/shared'

import { FormError } from '@/client/components/form-error'
import { FormSuccess } from '@/client/components/form-success'
import { CardWrapper } from '../_components/card-wrapper'
import { useTranslate } from '@/client/i18n/client'
import { useApi } from '@/client/store/api-store'

const NewPasswordPage = () => {
  const { authApi } = useApi()
  const { t } = useTranslate()
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
      setSuccess(t('Password changed successfully!'))
    } catch (error: any) {
      setError(t(error.message, { ns: 'backend' }))
    }
  }

  return (
    <CardWrapper headerLabel={t('Reset password')} backButtonLabel={t('Back to login')} backButtonHref="/auth/login">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <Input
            variant="flat"
            label={t('New password')}
            disabled={isSubmitting}
            placeholder={t('Please enter new password')}
            isClearable
            type="password"
            isInvalid={Boolean(errors.password)}
            errorMessage={t(errors.password?.message || '', { ns: 'validation' })}
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
          {t('Reset password')}
        </Button>
      </form>
    </CardWrapper>
  )
}

export default NewPasswordPage
