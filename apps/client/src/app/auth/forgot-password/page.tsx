'use client'

import { useForm } from 'react-hook-form'
import { useState, useTransition } from 'react'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'

import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { FormError } from '@/components/form-error'
import { FormSuccess } from '@/components/form-success'
import { CardWrapper } from '../_components/card-wrapper'
import { authApi } from '@/api/client'
import { ForgotPasswordDto } from '@shared'

const ForgotPasswordPage = () => {
  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')

  const form = useForm<ForgotPasswordDto>({
    resolver: classValidatorResolver(ForgotPasswordDto)
  })

  const onSubmit = async (values: ForgotPasswordDto) => {
    setError('')
    setSuccess('')

    try {
      const res = await authApi.forgotPassword(values)
      setSuccess(res)
    } catch (error: any) {
      setError(error.message)
    }
  }

  return (
    <CardWrapper headerLabel="忘记密码?" backButtonLabel="回到登录" backButtonHref="/auth/login">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>邮箱</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={form.formState.isSubmitting} placeholder="请输入邮箱" type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={form.formState.isSubmitting} type="submit" className="w-full">
            发送重置邮件
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}

export default ForgotPasswordPage
