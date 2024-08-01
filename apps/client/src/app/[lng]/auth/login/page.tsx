'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

import { ms } from '@ying/utils'
import { ClientLoginDto } from '@ying/shared'

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/client/components/ui/form'
import { Button } from '@/client/components/ui/button'
import { Input } from '@/client/components/ui/input'
import { Link } from '@/client/components/link'
import { FormError } from '@/client/components/ui/form-error'
import { FormSuccess } from '@/client/components/ui/form-success'

import { AppKey } from '@/client/enum'
import { useAuthStore } from '@/client/store/auth-store'
import { useTranslate } from '@/client/i18n/client'
import { useApi } from '@/client/store/app-store'
import { useAppContext } from '@/client/providers/app'
import { ErrorRes } from '@/client/api/client/request'
import { CardWrapper } from '../_components/card-wrapper'

const LoginPage = () => {
  const { domain, accessTokenExpiresIn, refreshTokenExpiresIn } = useAppContext()
  const { authApi } = useApi()
  const { t } = useTranslate('auth')
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
      setAuthToken(res)

      const ssoCallbackUrl = Cookies.get(AppKey.CookieSSOCallbackKey)
      if (ssoCallbackUrl) {
        Cookies.remove(AppKey.CookieSSOCallbackKey)

        return router.replace(ssoCallbackUrl)
      }

      router.replace('/')
    } catch (error) {
      setError(t((error as ErrorRes)?.message))
    }
  }

  return (
    <CardWrapper
      headerLabel={t('text.welcome_to')}
      backButtonLabel={t('text.no_account')}
      backButtonHref="/auth/register"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('text.email')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('text.please_enter_email')} disabled={isSubmitting} clearable {...field} />
                </FormControl>
                <FormMessage>{t(errors.email?.message || '')}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('text.password')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('text.please_enter_password')}
                    autoComplete=""
                    clearable
                    disabled={isSubmitting}
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage>{t(errors.password?.message || '')}</FormMessage>
              </FormItem>
            )}
          />

          <Button size="sm" variant="ghost">
            <Link href="/auth/forgot-password">{t('text.forgot_password')}</Link>
          </Button>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button color="primary" loading={isSubmitting} type="submit" className="w-full">
            {t('text.login')}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}

export default LoginPage
