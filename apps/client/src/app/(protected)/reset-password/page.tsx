'use client'

import { useForm } from 'react-hook-form'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { toast } from 'sonner'

import { ResetPasswordDto } from '@shared'

import { userApi } from '@/api/client'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormErrorMessage, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { logout, useAuthStore } from '@/store/auth-store'
import { useRouter } from 'next/navigation'
import { useTranslate } from '@/i18n/client'

const ResetPasswordPage = () => {
  const { t } = useTranslate()
  const router = useRouter()
  const userInfo = useAuthStore(state => state.userInfo)

  const form = useForm<ResetPasswordDto>({
    resolver: classValidatorResolver(ResetPasswordDto),
    defaultValues: {
      oldPassword: '',
      newPassword: ''
    }
  })

  const { errors, isSubmitting } = form.formState

  const onSubmit = async (values: ResetPasswordDto) => {
    try {
      await userApi.resetPassword(values)
      toast.success(t('Password changed successfully!'))
      await logout()
      router.replace('/')
    } catch (error: any) {
      toast.error(t(error?.message, { ns: 'backend' }))
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
                  <FormLabel>{t('Old password')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isSubmitting}
                      placeholder={t('Please enter old password')}
                      type="password"
                      autoComplete="old-password"
                    />
                  </FormControl>
                  <FormErrorMessage>{t(errors.oldPassword?.message, { ns: 'validation' })}</FormErrorMessage>
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('New password')}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isSubmitting}
                    placeholder={t('Please enter new password')}
                    type="password"
                    autoComplete="new-password"
                  />
                </FormControl>
                <FormErrorMessage>{t(errors.newPassword?.message, { ns: 'validation' })}</FormErrorMessage>
              </FormItem>
            )}
          />
          <Button disabled={isSubmitting} type="submit" className="w-full">
            {userInfo?.hasPassword ? t('Confirm reset') : t('Set password')}
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default ResetPasswordPage
