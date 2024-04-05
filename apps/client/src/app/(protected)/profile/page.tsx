'use client'

import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { toast } from 'sonner'
import { Button, Input } from '@nextui-org/react'

import { UpdateUserInfoDto } from '@shared'

import { UploadImage } from '@/components/upload-image'
import { useAuth, useAuthStore } from '@/store/auth-store'
import { useTranslate } from '@/i18n/client'
import { useApi } from '@/store/api-store'

const ProfilePage = () => {
  const { getProfile } = useAuth()
  const { fileApi, userApi } = useApi()
  const { t } = useTranslate()
  const userInfo = useAuthStore(state => state.userInfo)

  const form = useForm<UpdateUserInfoDto>({
    resolver: classValidatorResolver(UpdateUserInfoDto),
    defaultValues: {
      name: '',
      avatarId: 0
    }
  })
  const {
    register,
    control,
    formState: { errors, isSubmitting }
  } = form

  const onSubmit = async (values: UpdateUserInfoDto) => {
    try {
      await userApi.updateUserInfo(values)
      toast.success(t('Successfully modified user information!'))
      getProfile()
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (userInfo) {
      form.reset({
        name: userInfo.name,
        avatarId: userInfo.avatarId
      })
    }
  }, [userInfo, form])

  return (
    <div className="w-full h-full p-4">
      {userInfo && (
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
          <Input
            className="mb-4"
            variant="bordered"
            labelPlacement="outside"
            label={t('Email')}
            value={userInfo.email}
            isDisabled
          />
          <Input
            className="mb-4"
            variant="bordered"
            labelPlacement="outside"
            label={t('Nickname')}
            isDisabled={isSubmitting}
            placeholder={t('Please enter nickname')}
            isInvalid={Boolean(errors.name)}
            errorMessage={t(errors.name?.message, { ns: 'validation' })}
            defaultValue={userInfo?.name}
            {...register('name')}
          />

          <Controller
            control={control}
            name="avatarId"
            render={({ field }) => (
              <div className="mb-6">
                <p className="text-sm">{t('Avatar')}</p>
                <div className="w-full flex justify-center">
                  <UploadImage
                    defaultUrl={userInfo.avatar?.url}
                    disabled={isSubmitting}
                    handleUpload={file => fileApi.upload(file)}
                    onSuccess={fileEntity => {
                      field.onChange(fileEntity.id)
                      toast.success(t('Image uploaded successfully!'))
                    }}
                  />
                </div>
              </div>
            )}
          />

          <Button color="primary" isLoading={isSubmitting} type="submit" className="w-full">
            {t('Confirm modifications')}
          </Button>
        </form>
      )}
    </div>
  )
}

export default ProfilePage
