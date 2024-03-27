'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { toast } from 'sonner'

import { UpdateUserInfoDto } from '@shared'

import { fileApi, userApi } from '@/api/client'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { UploadImage } from '@/components/upload-image'
import { getProfile, useAuthStore } from '@/store/auth-store'

const ProfilePage = () => {
  const userInfo = useAuthStore(state => state.userInfo)

  const form = useForm<UpdateUserInfoDto>({
    resolver: classValidatorResolver(UpdateUserInfoDto),
    defaultValues: {
      name: '',
      avatarId: 0
    }
  })

  const onSubmit = async (values: UpdateUserInfoDto) => {
    try {
      await userApi.updateUserInfo(values)
      toast.success('修改用户信息成功!')
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
              <FormLabel>邮箱</FormLabel>
              <FormControl>
                <Input value={userInfo.email} disabled={true} />
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>昵称</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={form.formState.isSubmitting} placeholder="请输入昵称" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="avatarId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>头像</FormLabel>
                  <FormControl>
                    <div className="flex justify-center">
                      <UploadImage
                        defaultUrl={userInfo.avatar?.url}
                        disabled={form.formState.isSubmitting}
                        handleUpload={file => fileApi.upload(file)}
                        onSuccess={fileEntity => {
                          field.onChange(fileEntity.id)
                          toast.success('图片上传成功!')
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={form.formState.isSubmitting} type="submit" className="w-full">
              确认修改
            </Button>
          </form>
        </Form>
      )}
    </div>
  )
}

export default ProfilePage
