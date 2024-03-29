'use client'

import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'

import { NewPasswordDto } from '@shared'

import { Input } from '@/components/ui/input'
import { Form, FormControl, FormErrorMessage, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { FormError } from '@/components/form-error'
import { FormSuccess } from '@/components/form-success'
import { CardWrapper } from '../_components/card-wrapper'
import { authApi } from '@/api/client'
import { useTranslate } from '@/i18n/client'

const NewPasswordPage = () => {
  const { t } = useTranslate()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const email = searchParams.get('email')

  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')

  const form = useForm<NewPasswordDto>({
    resolver: classValidatorResolver(NewPasswordDto),
    defaultValues: {
      token,
      email,
      password: ''
    }
  })

  const { errors, isSubmitting } = form.formState

  const onSubmit = async (values: NewPasswordDto) => {
    setError('')
    setSuccess('')

    try {
      await authApi.newPassword(values)
      setSuccess(t('Password changed successfully!'))
    } catch (error: any) {
      setError(t(error.message, { ns: 'backend' }))
    }
  }

  return (
    <CardWrapper headerLabel={t('Reset password')} backButtonLabel={t('Back to login')} backButtonHref="/auth/login">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('New password')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isSubmitting}
                      placeholder={t('Please enter new password')}
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
          <Button disabled={isSubmitting} type="submit" className="w-full">
            {t('Reset password')}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}

export default NewPasswordPage
