'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { toast } from 'sonner'

import { UpdateUserInfoDto } from '@shared'

import { fileApi, userApi } from '@/api/client'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormErrorMessage, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { UploadImage } from '@/components/upload-image'
import { getProfile, useAuthStore } from '@/store/auth-store'
import { useTranslate } from '@/i18n/client'

const ProfilePage = () => {
  const { t } = useTranslate()
  const userInfo = useAuthStore(state => state.userInfo)

  const form = useForm<UpdateUserInfoDto>({
    resolver: classValidatorResolver(UpdateUserInfoDto),
    defaultValues: {
      name: '',
      avatarId: 0
    }
  })

  const { errors, isSubmitting } = form.formState

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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormItem>
              <FormLabel>{t('Email')}</FormLabel>
              <FormControl>
                <Input value={userInfo.email} disabled={true} />
              </FormControl>
            </FormItem>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Nickname')}</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isSubmitting} placeholder={t('Please enter nickname')} />
                  </FormControl>
                  <FormErrorMessage>{t(errors.name?.message, { ns: 'validation' })}</FormErrorMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="avatarId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Avatar')}</FormLabel>
                  <FormControl>
                    <div className="flex justify-center">
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
                  </FormControl>
                </FormItem>
              )}
            />
            <Button disabled={isSubmitting} type="submit" className="w-full">
              {t('Confirm modifications')}
            </Button>
          </form>
        </Form>
      )}
    </div>
  )
}

export default ProfilePage
