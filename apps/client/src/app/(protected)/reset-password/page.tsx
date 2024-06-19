'use client'

import { useForm } from 'react-hook-form'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

import { ResetPasswordDto } from '@ying/shared'

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/client/components/ui/form'
import { Input } from '@/client/components/ui/input'
import { Button } from '@/client/components/ui/button'
import { useTranslate } from '@/client/i18n/client'
import { useApi } from '@/client/store/app-store'
import { useAuth, useAuthStore } from '@/client/store/auth-store'
import { ErrorRes } from '@/client/api/client/request'

const ResetPasswordPage = () => {
  const { userApi } = useApi()
  const { logout } = useAuth()
  const { t } = useTranslate('auth')
  const router = useRouter()
  const userInfo = useAuthStore(state => state.userInfo)

  const form = useForm<ResetPasswordDto>({
    resolver: classValidatorResolver(ResetPasswordDto),
    defaultValues: {
      oldPassword: '',
      newPassword: ''
    }
  })

  const {
    formState: { errors, isSubmitting }
  } = form

  const onSubmit = async (values: ResetPasswordDto) => {
    if (!userApi) return
    try {
      await userApi.resetPassword(values)
      toast.success(t('success.password_changed_successfully'))
      await logout()
      router.replace('/')
    } catch (error) {
      toast.error(t((error as ErrorRes)?.message))
    }
  }

  return (
    <div className="w-full h-full p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {userInfo?.hasPassword && (
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('text.old_password')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('text.please_enter_old_password')}
                      type="password"
                      autoComplete="old-password"
                      disabled={isSubmitting}
                      clearable
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>{t(errors.oldPassword?.message || '')}</FormMessage>
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('text.new_password')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('text.please_enter_new_password')}
                    type="password"
                    autoComplete="new-password"
                    disabled={isSubmitting}
                    clearable
                    {...field}
                  />
                </FormControl>
                <FormMessage>{t(errors.newPassword?.message || '')}</FormMessage>
              </FormItem>
            )}
          />
          <Button color="primary" loading={isSubmitting} type="submit" className="w-full">
            {userInfo?.hasPassword ? t('text.confirm_reset') : t('text.set_password')}
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default ResetPasswordPage
