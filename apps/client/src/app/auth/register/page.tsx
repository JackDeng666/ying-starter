'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { Button, Input } from '@nextui-org/react'

import { ClientRegisterDto } from '@ying/shared'

import { FormError } from '@/client/components/form-error'
import { FormSuccess } from '@/client/components/form-success'
import { useTranslate } from '@/client/i18n/client'
import { useApi } from '@/client/store/app-store'
import { CardWrapper } from '../_components/card-wrapper'
import { ErrorRes } from '@/client/api/client/request'

const LoginPage = () => {
  const { authApi } = useApi()
  const { t } = useTranslate('auth')
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
    if (!authApi) return
    setSuccess('')
    setError('')
    try {
      await authApi.register(values)
      setSuccess(t('success.confirm_email_has_been_sent'))
    } catch (error) {
      setError(t((error as ErrorRes)?.message))
    }
  }

  return (
    <CardWrapper
      headerLabel={t('text.register_an_account')}
      backButtonLabel={t('text.already_have_an_account')}
      backButtonHref="/auth/login"
      showSocial
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Input
          variant="flat"
          label={t('text.nickname')}
          disabled={isSubmitting}
          placeholder={t('text.please_enter_nickname')}
          isClearable
          isInvalid={Boolean(errors.name)}
          errorMessage={t(errors.name?.message || '')}
          classNames={{
            innerWrapper: 'h-16',
            inputWrapper: 'h-16',
            label: 'text-base'
          }}
          {...register('name')}
        />
        <Input
          variant="flat"
          label={t('text.email')}
          disabled={isSubmitting}
          placeholder={t('text.please_enter_email')}
          isClearable
          isInvalid={Boolean(errors.email)}
          errorMessage={t(errors.email?.message || '')}
          classNames={{
            innerWrapper: 'h-16',
            inputWrapper: 'h-16',
            label: 'text-base'
          }}
          {...register('email')}
        />
        <Input
          variant="flat"
          label={t('text.password')}
          disabled={isSubmitting}
          placeholder={t('text.please_enter_password')}
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
        <FormError message={error} />
        <FormSuccess message={success} />
        <Button color="primary" isLoading={isSubmitting} type="submit" className="w-full">
          {t('text.register')}
        </Button>
      </form>
    </CardWrapper>
  )
}

export default LoginPage
