'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { Button, Input } from '@nextui-org/react'
import Link from 'next/link'

import { ms } from '@ying/utils'

import { ClientLoginDto } from '@shared'
import { FormError } from '@/components/form-error'
import { FormSuccess } from '@/components/form-success'
import { CardWrapper } from '../_components/card-wrapper'
import { AppKey } from '@/enum'
import { useAuthStore } from '@/store/auth-store'
import { useTranslate } from '@/i18n/client'
import { useApi } from '@/store/api-store'
import { useAppContext } from '@/components/app-provider'

const LoginPage = () => {
  const { domain, authExpiresIn } = useAppContext()
  const { authApi } = useApi()
  const { t } = useTranslate()
  const router = useRouter()
  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')
  const setUserToken = useAuthStore(state => state.setUserToken)

  const form = useForm<ClientLoginDto>({
    resolver: classValidatorResolver(ClientLoginDto),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const {
    register,
    formState: { errors, isSubmitting }
  } = form

  const onSubmit = async (values: ClientLoginDto) => {
    setError('')
    setSuccess('')

    try {
      const res = await authApi.login(values)
      Cookies.set(AppKey.CookieTokenKey, res, {
        domain,
        sameSite: 'strict',
        expires: new Date(Date.now() + ms(authExpiresIn))
      })
      const ssoCallbackUrl = Cookies.get(AppKey.CookieSSOCallbackKey)
      if (ssoCallbackUrl) {
        Cookies.remove(AppKey.CookieSSOCallbackKey)
        window.location.href = ssoCallbackUrl
      }
      setUserToken(res)
      router.refresh()
    } catch (error: any) {
      setError(t(error.message, { ns: 'backend' }))
    }
  }

  return (
    <CardWrapper
      headerLabel={t('Welcome to')}
      backButtonLabel={t('No account?')}
      backButtonHref="/auth/register"
      showSocial
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Input
          variant="flat"
          label={t('Email')}
          isDisabled={isSubmitting}
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
          isDisabled={isSubmitting}
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
        <Button size="sm" variant="light">
          <Link href="/auth/forgot-password">{t('Forgot password?')}</Link>
        </Button>
        <FormError message={error} />
        <FormSuccess message={success} />
        <Button color="primary" isLoading={isSubmitting} type="submit" className="w-full">
          {t('Login')}
        </Button>
      </form>
    </CardWrapper>
  )
}

export default LoginPage
