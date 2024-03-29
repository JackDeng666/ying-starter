'use client'

import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'

import { Input } from '@/components/ui/input'
import { Form, FormControl, FormErrorMessage, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { FormError } from '@/components/form-error'
import { FormSuccess } from '@/components/form-success'
import { CardWrapper } from '../_components/card-wrapper'
import { authApi } from '@/api/client'
import { ForgotPasswordDto } from '@shared'
import { useTranslate } from '@/i18n/client'

const ForgotPasswordPage = () => {
  const { t } = useTranslate()
  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')

  const form = useForm<ForgotPasswordDto>({
    resolver: classValidatorResolver(ForgotPasswordDto),
    defaultValues: {
      email: ''
    }
  })
  const { errors, isSubmitting } = form.formState

  const onSubmit = async (values: ForgotPasswordDto) => {
    setError('')
    setSuccess('')

    try {
      await authApi.forgotPassword(values)
      setSuccess(t('Password reset email sent successfully!'))
    } catch (error: any) {
      setError(t(error.message, { ns: 'backend' }))
    }
  }

  return (
    <CardWrapper headerLabel={t('Forgot password?')} backButtonLabel={t('Back to login')} backButtonHref="/auth/login">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Email')}</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isSubmitting} placeholder={t('Please enter email')} type="email" />
                  </FormControl>
                  <FormErrorMessage>{t(errors.email?.message, { ns: 'validation' })}</FormErrorMessage>
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={isSubmitting} type="submit" className="w-full">
            {t('Send reset email')}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}

export default ForgotPasswordPage
