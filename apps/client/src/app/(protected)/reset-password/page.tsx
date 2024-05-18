'use client'

import { useForm } from 'react-hook-form'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { toast } from 'sonner'
import { Button, Input } from '@nextui-org/react'
import { useRouter } from 'next/navigation'

import { ResetPasswordDto } from '@ying/shared'

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
    register,
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
        {userInfo?.hasPassword && (
          <Input
            className="mb-4"
            variant="bordered"
            labelPlacement="outside"
            label={t('text.old_password')}
            isDisabled={isSubmitting}
            placeholder={t('text.please_enter_old_password')}
            type="password"
            autoComplete="old-password"
            isInvalid={Boolean(errors.oldPassword)}
            errorMessage={t(errors.oldPassword?.message || '')}
            {...register('oldPassword')}
          />
        )}
        <Input
          className="mb-4"
          variant="bordered"
          labelPlacement="outside"
          label={t('text.new_password')}
          isDisabled={isSubmitting}
          placeholder={t('text.please_enter_new_password')}
          type="password"
          autoComplete="new-password"
          isInvalid={Boolean(errors.newPassword)}
          errorMessage={t(errors.newPassword?.message || '')}
          {...register('newPassword')}
        />
        <Button color="primary" isLoading={isSubmitting} type="submit" className="w-full">
          {userInfo?.hasPassword ? t('text.confirm_reset') : t('text.set_password')}
        </Button>
      </form>
    </div>
  )
}

export default ResetPasswordPage
