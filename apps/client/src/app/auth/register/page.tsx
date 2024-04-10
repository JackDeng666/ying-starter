'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { Button, Input } from '@nextui-org/react'

import { ClientRegisterDto } from '@shared'

import { FormError } from '@/components/form-error'
import { FormSuccess } from '@/components/form-success'
import { CardWrapper } from '../_components/card-wrapper'
import { useTranslate } from '@/i18n/client'
import { useApi } from '@/store/api-store'

const LoginPage = () => {
  const { authApi } = useApi()
  const { t } = useTranslate()
  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')

  const form = useForm<ClientRegisterDto>({
    resolver: classValidatorResolver(ClientRegisterDto),
    defaultValues: {
      email: '',
      password: '',
      name: ''
    }
  })

  const {
    register,
    formState: { errors, isSubmitting }
  } = form

  const onSubmit = async (values: ClientRegisterDto) => {
    setSuccess('')
    setError('')
    try {
      await authApi.register(values)
      setSuccess(t('Confirm email has been sent!'))
    } catch (error: any) {
      setError(t(error.message, { ns: 'backend' }))
    }
  }

  return (
    <CardWrapper
      headerLabel={t('Register an account')}
      backButtonLabel={t('Already have an account?')}
      backButtonHref="/auth/login"
      showSocial
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Input
          variant="flat"
          label={t('Nickname')}
          disabled={isSubmitting}
          placeholder={t('Please enter nickname')}
          isClearable
          isInvalid={Boolean(errors.name)}
          errorMessage={t(errors.name?.message, { ns: 'validation' })}
          classNames={{
            innerWrapper: 'h-16',
            inputWrapper: 'h-16',
            label: 'text-base'
          }}
          {...register('name')}
        />
        <Input
          variant="flat"
          label={t('Email')}
          disabled={isSubmitting}
          placeholder={t('Please enter email')}
          isClearable
          isInvalid={Boolean(errors.email)}
          errorMessage={t(errors.email?.message, { ns: 'validation' })}
          classNames={{
            innerWrapper: 'h-16',
            inputWrapper: 'h-16',
            label: 'text-base'
          }}
          {...register('email')}
        />
        <Input
          variant="flat"
          label={t('Password')}
          disabled={isSubmitting}
          placeholder={t('Please enter password')}
          isClearable
          type="password"
          isInvalid={Boolean(errors.password)}
          errorMessage={t(errors.password?.message, { ns: 'validation' })}
          classNames={{
            innerWrapper: 'h-16',
            inputWrapper: 'h-16',
            label: 'text-base'
          }}
          {...register('password')}
        />
        <FormError message={error} />
        <FormSuccess message={success} />
        <Button color="primary" isLoading={isSubmitting} type="submit" className="w-full">
          {t('Register')}
        </Button>
      </form>
    </CardWrapper>
  )
}

export default LoginPage
