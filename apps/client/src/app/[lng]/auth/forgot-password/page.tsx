'use client'

import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'

import { ForgotPasswordDto } from '@ying/shared'

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/client/components/ui/form'
import { Input } from '@/client/components/ui/input'
import { Button } from '@/client/components/ui/button'
import { FormError } from '@/client/components/ui/form-error'
import { FormSuccess } from '@/client/components/ui/form-success'
import { CardWrapper } from '../_components/card-wrapper'
import { useTranslate } from '@/client/i18n/client'
import { useApi } from '@/client/store/app-store'
import { ErrorRes } from '@/client/api/client/request'

const ForgotPasswordPage = () => {
  const { authApi } = useApi()
  const { t } = useTranslate('auth')
  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')

  const form = useForm<ForgotPasswordDto>({
    resolver: classValidatorResolver(ForgotPasswordDto),
    defaultValues: {
      email: ''
    }
  })
  const {
    formState: { errors, isSubmitting }
  } = form

  const onSubmit = async (values: ForgotPasswordDto) => {
    if (!authApi) return
    setError('')
    setSuccess('')

    try {
      await authApi.forgotPassword(values)
      setSuccess(t('success.password_reset_email_sent_successfully'))
    } catch (error) {
      setError(t((error as ErrorRes)?.message))
    }
  }

  return (
    <CardWrapper
      headerLabel={t('text.forgot_password')}
      backButtonLabel={t('text.back_to_login')}
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

          <FormError message={error} />
          <FormSuccess message={success} />
          <Button color="primary" loading={isSubmitting} type="submit" className="w-full">
            {t('text.send_reset_email')}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}

export default ForgotPasswordPage
