'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

import { ClientLoginDto } from '@shared'

import { Input } from '@/components/ui/input'
import { Form, FormControl, FormErrorMessage, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { FormError } from '@/components/form-error'
import { FormSuccess } from '@/components/form-success'
import { CardWrapper } from '../_components/card-wrapper'
import { authApi } from '@/api/client'
import { AppKey } from '@/enum'
import { useAuthStore } from '@/store/auth-store'
import { useTranslate } from '@/i18n/client'

const LoginPage = () => {
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

  const onSubmit = async (values: ClientLoginDto) => {
    setError('')
    setSuccess('')

    try {
      const res = await authApi.login(values)
      Cookies.set(AppKey.CookieTokenKey, res)
      setUserToken(res)
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel color="red">{t('Email')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={form.formState.isSubmitting}
                      placeholder={t('Please enter email')}
                      type="email"
                    />
                  </FormControl>
                  <FormErrorMessage>{t(form.formState.errors.email?.message, { ns: 'validation' })}</FormErrorMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Password')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={form.formState.isSubmitting}
                      placeholder={t('Please enter password')}
                      type="password"
                    />
                  </FormControl>
                  <FormErrorMessage>
                    {t(form.formState.errors.password?.message, { ns: 'validation' })}
                  </FormErrorMessage>
                  <Button size="sm" variant="link" asChild className="px-0 font-normal">
                    <Link href="/auth/forgot-password">{t('Forgot password?')}</Link>
                  </Button>
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={form.formState.isSubmitting} type="submit" className="w-full">
            {t('Login')}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}

export default LoginPage
