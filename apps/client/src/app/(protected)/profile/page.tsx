'use client'

import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { toast } from 'sonner'
import { Button, Input } from '@nextui-org/react'

import { UpdateUserInfoDto } from '@ying/shared'

import { UploadImage } from '@/client/components/image/upload-image'
import { useAuth, useAuthStore } from '@/client/store/auth-store'
import { useApi } from '@/client/store/app-store'
import { useTranslate } from '@/client/i18n/client'
import { ErrorRes } from '@/client/api/client/request'

const ProfilePage = () => {
  const { getProfile } = useAuth()
  const { fileApi, userApi } = useApi()
  const { t } = useTranslate('auth')
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
    if (!userApi) return
    try {
      await userApi.updateUserInfo(values)
      toast.success(t('success.successfully_modified_user_information'))
      getProfile()
    } catch (error) {
      toast.error(t((error as ErrorRes)?.message))
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
            label={t('text.email')}
            value={userInfo.email}
            isDisabled
          />
          <Input
            className="mb-4"
            variant="bordered"
            labelPlacement="outside"
            label={t('text.nickname')}
            isDisabled={isSubmitting}
            placeholder={t('text.please_enter_nickname')}
            isInvalid={Boolean(errors.name)}
            errorMessage={t(errors.name?.message || '')}
            defaultValue={userInfo?.name}
            {...register('name')}
          />

          <Controller
            control={control}
            name="avatarId"
            render={({ field }) => (
              <div className="mb-6">
                <p className="text-sm">{t('text.avatar')}</p>
                <div className="w-full flex justify-center">
                  <UploadImage
                    defaultUrl={userInfo.avatar?.url}
                    disabled={isSubmitting}
                    withCrop
                    aspectRatio={1}
                    handleUpload={file => {
                      if (!fileApi) return
                      return fileApi.upload(file)
                    }}
                    onSuccess={fileEntity => {
                      field.onChange(fileEntity.id)
                      toast.success(t('success.image_uploaded_successfully'))
                    }}
                  />
                </div>
              </div>
            )}
          />

          <Button color="primary" isLoading={isSubmitting} type="submit" className="w-full">
            {t('text.confirm_modifications')}
          </Button>
        </form>
      )}
    </div>
  )
}

export default ProfilePage
