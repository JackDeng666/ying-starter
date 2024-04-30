'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { Button, Input } from '@nextui-org/react'
import Link from 'next/link'

import { ms } from '@ying/utils'

import { ClientLoginDto } from '@ying/shared'
import { FormError } from '@/client/components/form-error'
import { FormSuccess } from '@/client/components/form-success'
import { CardWrapper } from '../_components/card-wrapper'
import { AppKey } from '@/client/enum'
import { useAuthStore } from '@/client/store/auth-store'
import { useTranslate } from '@/client/i18n/client'
import { useApi } from '@/client/store/api-store'
import { useAppContext } from '@/client/components/app-provider'

const LoginPage = () => {
  const { domain, accessTokenExpiresIn, refreshTokenExpiresIn } = useAppContext()
  const { authApi } = useApi()
  const { t } = useTranslate()
  const router = useRouter()
  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')
  const setAuthToken = useAuthStore(state => state.setAuthToken)

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
    if (!authApi) return
    setError('')
    setSuccess('')

    try {
      const res = await authApi.login(values)
      Cookies.set(AppKey.CookieAccessTokenKey, res.accessToken, {
        domain,
        expires: new Date(Date.now() + ms(accessTokenExpiresIn))
      })
      Cookies.set(AppKey.CookieRefreshTokenKey, res.refreshToken, {
        domain,
        expires: new Date(Date.now() + ms(refreshTokenExpiresIn))
      })

      const ssoCallbackUrl = Cookies.get(AppKey.CookieSSOCallbackKey)
      if (ssoCallbackUrl) {
        Cookies.remove(AppKey.CookieSSOCallbackKey)
        window.location.href = ssoCallbackUrl
      }

      setAuthToken(res)
      router.replace('/')
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
          errorMessage={t(errors.email?.message || '', { ns: 'validation' })}
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
          errorMessage={t(errors.password?.message || '', { ns: 'validation' })}
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
