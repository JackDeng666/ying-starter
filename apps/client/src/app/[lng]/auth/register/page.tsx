'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'

import { ClientRegisterDto } from '@ying/shared'

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/client/components/ui/form'
import { Input } from '@/client/components/ui/input'
import { Button } from '@/client/components/ui/button'
import { FormError } from '@/client/components/ui/form-error'
import { FormSuccess } from '@/client/components/ui/form-success'
import { useTranslate } from '@/client/i18n/client'
import { useApi } from '@/client/store/app-store'
import { ErrorRes } from '@/client/api/client/request'
import { CardWrapper } from '../_components/card-wrapper'

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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('text.nickname')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('text.please_enter_nickname')} disabled={isSubmitting} clearable {...field} />
                </FormControl>
                <FormMessage>{t(errors.name?.message || '')}</FormMessage>
              </FormItem>
            )}
          />

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
                    type="password"
                    disabled={isSubmitting}
                    clearable
                    {...field}
                  />
                </FormControl>
                <FormMessage>{t(errors.password?.message || '')}</FormMessage>
              </FormItem>
            )}
          />

          <FormError message={error} />
          <FormSuccess message={success} />
          <Button color="primary" loading={isSubmitting} type="submit" className="w-full">
            {t('text.register')}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}

export default LoginPage
