'use client'

import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'

import { NewPasswordDto } from '@shared'

import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { FormError } from '@/components/form-error'
import { FormSuccess } from '@/components/form-success'
import { CardWrapper } from '../_components/card-wrapper'
import { authApi } from '@/api/client'

const NewPasswordPage = () => {
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

  const onSubmit = async (values: NewPasswordDto) => {
    setError('')
    setSuccess('')

    try {
      const res = await authApi.newPassword(values)
      setSuccess(res)
    } catch (error: any) {
      setError(error.message)
    }
  }

  return (
    <CardWrapper headerLabel="重置密码" backButtonLabel="回到登录" backButtonHref="/auth/login">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>新密码</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={form.formState.isSubmitting}
                      placeholder="请输入您的新密码"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={form.formState.isSubmitting} type="submit" className="w-full">
            重置密码
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}

export default NewPasswordPage
