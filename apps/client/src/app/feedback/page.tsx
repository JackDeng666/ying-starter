'use client'

import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { toast } from 'sonner'

import { CreateFeedbackDto } from '@ying/shared'

import { MaxWidthWrapper } from '@/client/components/max-width-wrapper'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/client/components/ui/form'
import { Card, CardContent } from '@/client/components/ui/card'
import { Input } from '@/client/components/ui/input'
import { Textarea } from '@/client/components/ui/textarea'
import { Button } from '@/client/components/ui/button'
import { FeedbackSvg } from '@/client/components/svg/feedback'
import { useApi } from '@/client/store/app-store'
import { useTranslate } from '@/client/i18n/client'

export default function Page() {
  const { t } = useTranslate()
  const { commonApi } = useApi()
  const formRef = useRef<HTMLFormElement>(null)
  const form = useForm<CreateFeedbackDto>({
    resolver: classValidatorResolver(CreateFeedbackDto),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      content: ''
    }
  })

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    reset
  } = form

  const disabled = isSubmitting

  const onSubmit = async (values: CreateFeedbackDto) => {
    if (!commonApi) return
    try {
      await commonApi.createFeedback(values)
      toast.success(t('submit_success'))
      reset()
    } catch (error) {}
  }

  const submitFunc = handleSubmit(onSubmit)

  return (
    <MaxWidthWrapper className="my-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-4">
        <FeedbackSvg className="w-full h-full" />
        <Card className="rounded-sm">
          <CardContent className="p-4">
            <Form {...form}>
              <form ref={formRef} className="space-y-2">
                <div className="flex gap-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>{t('text.first_name')}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('text.please_enter_first_name')}
                            disabled={disabled}
                            clearable
                            {...field}
                          />
                        </FormControl>
                        <FormMessage>{t(errors.firstName?.message || '')}</FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>{t('text.last_name')}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('text.please_enter_last_name')}
                            disabled={disabled}
                            clearable
                            {...field}
                          />
                        </FormControl>
                        <FormMessage>{t(errors.lastName?.message || '')}</FormMessage>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel aria-required>{t('text.email')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('text.please_enter_email')} disabled={disabled} clearable {...field} />
                      </FormControl>
                      <FormMessage>{t(errors.email?.message || '')}</FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel aria-required>{t('text.content')}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t('text.please_enter_content')}
                          disabled={disabled}
                          clearable
                          {...field}
                        />
                      </FormControl>
                      <FormMessage>{t(errors.content?.message || '')}</FormMessage>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-x-2">
                  <Button onClick={submitFunc}>{t('text.send')}</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </MaxWidthWrapper>
  )
}
