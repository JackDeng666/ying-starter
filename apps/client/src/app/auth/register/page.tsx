'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'

import { ClientRegisterDto } from '@shared'

import { authApi } from '@/api/client'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormErrorMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { FormError } from '@/components/form-error'
import { FormSuccess } from '@/components/form-success'
import { CardWrapper } from '../_components/card-wrapper'
import { useTranslate } from '@/i18n/client'

const LoginPage = () => {
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

  const { errors } = form.formState

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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Nickname')}</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={form.formState.isSubmitting} placeholder={t('Please enter nickname')} />
                  </FormControl>
                  <FormErrorMessage>{t(errors.name?.message, { ns: 'validation' })}</FormErrorMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Email')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={form.formState.isSubmitting}
                      placeholder={t('Please enter email')}
                      type="email"
                    />
                  </FormControl>
                  <FormErrorMessage>{t(errors.email?.message, { ns: 'validation' })}</FormErrorMessage>
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
                  <FormErrorMessage>{t(errors.password?.message, { ns: 'validation' })}</FormErrorMessage>
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={form.formState.isSubmitting} type="submit" className="w-full">
            {t('Register')}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}

export default LoginPage
