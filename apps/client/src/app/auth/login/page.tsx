'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { FormError } from '@/components/form-error'
import { FormSuccess } from '@/components/form-success'
import { CardWrapper } from '../_components/card-wrapper'
import { ClientLoginDto } from '@shared'
import { authApi } from '@/api/client'
import { AppKey } from '@/enum'

const LoginPage = () => {
  const router = useRouter()
  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')

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
      router.replace('/')
    } catch (error: any) {
      setError(error.message)
    }
  }

  return (
    <CardWrapper
      headerLabel="欢迎来到 Ying Auth"
      backButtonLabel="没有账号?"
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
                  <Button size="sm" variant="link" asChild className="px-0 font-normal">
                    <Link href="/auth/forgot-password">忘记密码?</Link>
                  </Button>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={form.formState.isSubmitting} type="submit" className="w-full">
            登录
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}

export default LoginPage
