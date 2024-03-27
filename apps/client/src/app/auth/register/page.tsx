'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'

import { ClientRegisterDto } from '@shared'

import { authApi } from '@/api/client'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { FormError } from '@/components/form-error'
import { FormSuccess } from '@/components/form-success'
import { CardWrapper } from '../_components/card-wrapper'

const LoginPage = () => {
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

  const onSubmit = async (values: ClientRegisterDto) => {
    setSuccess('')
    setError('')
    try {
      const data = await authApi.register(values)
      setSuccess(data)
    } catch (error: any) {
      setError(error.message)
    }
  }

  return (
    <CardWrapper headerLabel="注册账号" backButtonLabel="已经有帐号了?" backButtonHref="/auth/login" showSocial>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>昵称</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={form.formState.isSubmitting} placeholder="请输入昵称" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>密码</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={form.formState.isSubmitting} placeholder="请输入密码" type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={form.formState.isSubmitting} type="submit" className="w-full">
            注册
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}

export default LoginPage
