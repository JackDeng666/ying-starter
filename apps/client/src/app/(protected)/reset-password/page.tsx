'use client'

import { useForm } from 'react-hook-form'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { toast } from 'sonner'
import { Button, Input } from '@nextui-org/react'

import { ResetPasswordDto } from '@ying/shared'

import { useAuth, useAuthStore } from '@/store/auth-store'
import { useRouter } from 'next/navigation'
import { useTranslate } from '@/i18n/client'
import { useApi } from '@/store/api-store'

const ResetPasswordPage = () => {
  const { userApi } = useApi()
  const { logout } = useAuth()
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

  const {
    register,
    formState: { errors, isSubmitting }
  } = form

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
        {userInfo?.hasPassword && (
          <Input
            className="mb-4"
            variant="bordered"
            labelPlacement="outside"
            label={t('Old password')}
            isDisabled={isSubmitting}
            placeholder={t('Please enter old password')}
            type="password"
            autoComplete="old-password"
            isInvalid={Boolean(errors.oldPassword)}
            errorMessage={t(errors.oldPassword?.message, { ns: 'validation' })}
            {...register('oldPassword')}
          />
        )}
        <Input
          className="mb-4"
          variant="bordered"
          labelPlacement="outside"
          label={t('New password')}
          isDisabled={isSubmitting}
          placeholder={t('Please enter new password')}
          type="password"
          autoComplete="new-password"
          isInvalid={Boolean(errors.newPassword)}
          errorMessage={t(errors.newPassword?.message, { ns: 'validation' })}
          {...register('newPassword')}
        />
        <Button color="primary" isLoading={isSubmitting} type="submit" className="w-full">
          {userInfo?.hasPassword ? t('Confirm reset') : t('Set password')}
        </Button>
      </form>
    </div>
  )
}

export default ResetPasswordPage
