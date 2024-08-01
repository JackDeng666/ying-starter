'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { toast } from 'sonner'

import { UpdateUserInfoDto } from '@ying/shared'

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/client/components/ui/form'
import { Input } from '@/client/components/ui/input'
import { Button } from '@/client/components/ui/button'
import { UploadImage } from '@/client/components/image/upload-image'
import { useAuth, useAuthStore } from '@/client/store/auth-store'
import { useApi } from '@/client/store/app-store'
import { useTranslate } from '@/client/i18n/client'
import { ErrorRes } from '@/client/api/client/request'

const ProfilePage = () => {
  const { getProfile } = useAuth()
  const { commonApi, userApi } = useApi()
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormItem>
              <FormLabel>{t('text.email')}</FormLabel>
              <FormControl>
                <Input disabled value={userInfo.email} />
              </FormControl>
            </FormItem>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('text.nickname')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('text.please_enter_nickname')} disabled={isSubmitting} clearable {...field} />
                  </FormControl>
                  <FormMessage>{t(errors.name?.message || '')}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="avatarId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('text.avatar')}</FormLabel>
                  <FormControl>
                    <div className="w-full flex justify-center">
                      <UploadImage
                        defaultUrl={userInfo.avatar?.url}
                        disabled={isSubmitting}
                        withCrop
                        aspectRatio={1}
                        handleUpload={file => {
                          if (!commonApi) return
                          return commonApi.upload(file)
                        }}
                        onSuccess={fileEntity => {
                          field.onChange(fileEntity.id)
                          toast.success(t('success.image_uploaded_successfully'))
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage>{t(errors.avatarId?.message || '')}</FormMessage>
                </FormItem>
              )}
            />

            <Button color="primary" loading={isSubmitting} type="submit" className="w-full">
              {t('text.confirm_modifications')}
            </Button>
          </form>
        </Form>
      )}
    </div>
  )
}

export default ProfilePage
