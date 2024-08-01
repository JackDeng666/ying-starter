'use client'

import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'

import { NewPasswordDto } from '@ying/shared'

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/client/components/ui/form'
import { Input } from '@/client/components/ui/input'
import { Button } from '@/client/components/ui/button'
import { FormError } from '@/client/components/ui/form-error'
import { FormSuccess } from '@/client/components/ui/form-success'
import { useTranslate } from '@/client/i18n/client'
import { useApi } from '@/client/store/app-store'
import { ErrorRes } from '@/client/api/client/request'
import { CardWrapper } from '../_components/card-wrapper'

const NewPasswordPage = () => {
  const { authApi } = useApi()
  const { t } = useTranslate('auth')
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || undefined
  const email = searchParams.get('email') || undefined

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

  const {
    formState: { errors, isSubmitting }
  } = form

  const onSubmit = async (values: NewPasswordDto) => {
    if (!authApi) return
    setError('')
    setSuccess('')

    try {
      await authApi.newPassword(values)
      setSuccess(t('success.password_changed_successfully'))
    } catch (error) {
      setError(t((error as ErrorRes).message))
    }
  }

  return (
    <CardWrapper
      headerLabel={t('text.reset_password')}
      backButtonLabel={t('text.back_to_login')}
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('text.new_password')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('text.please_enter_new_password')}
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
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button color="primary" loading={isSubmitting} type="submit" className="w-full">
            {t('text.reset_password')}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}

export default NewPasswordPage
