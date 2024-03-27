'use client'

import { useForm } from 'react-hook-form'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { toast } from 'sonner'

import { ResetPasswordDto } from '@shared'

import { userApi } from '@/api/client'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { logout, useAuthStore } from '@/store/auth-store'
import { useRouter } from 'next/navigation'

const ResetPasswordPage = () => {
  const router = useRouter()
  const userInfo = useAuthStore(state => state.userInfo)

  const form = useForm<ResetPasswordDto>({
    resolver: classValidatorResolver(ResetPasswordDto),
    defaultValues: {
      oldPassword: '',
      newPassword: ''
    }
  })

  const onSubmit = async (values: ResetPasswordDto) => {
    try {
      await userApi.resetPassword(values)
      toast.success('修改密码成功')
      await logout()
      router.replace('/')
    } catch (error: any) {
      toast.error(error?.message)
    }
  }

  return (
    <div className="w-full h-full p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {userInfo?.hasPassword && (
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>旧密码</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={form.formState.isSubmitting}
                      placeholder="请输入旧密码"
                      type="password"
                      autoComplete="old-password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>新密码</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={form.formState.isSubmitting}
                    placeholder="请输入新密码"
                    type="password"
                    autoComplete="new-password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={form.formState.isSubmitting} type="submit" className="w-full">
            {userInfo?.hasPassword ? '确认重置' : '设置密码'}
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default ResetPasswordPage
