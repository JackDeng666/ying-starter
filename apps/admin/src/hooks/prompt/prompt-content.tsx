import { Input } from 'antd'
import { type Ref, useImperativeHandle } from 'react'
import { useForm, Controller, type RegisterOptions } from 'react-hook-form'

type FormDataType = { val: string }

export type PromptOptions = {
  title: string
  defaultValue?: string
  placeholder?: string
  registerOptions?: RegisterOptions<FormDataType>
}

export type PromptContentRef = {
  validate(): Promise<string>
}

type PromptContentProps = PromptOptions & {
  ref?: Ref<PromptContentRef>
}

export const PromptContent = ({ ref, defaultValue, placeholder, registerOptions }: PromptContentProps) => {
  const {
    control,
    formState: { errors },
    register,
    trigger,
    getValues
  } = useForm<FormDataType>({
    defaultValues: {
      val: defaultValue
    }
  })

  useImperativeHandle(ref, () => ({
    async validate() {
      if (await trigger()) {
        return getValues().val
      } else {
        return Promise.reject(errors.val?.message)
      }
    }
  }))

  return (
    <Controller
      control={control}
      {...register('val', registerOptions)}
      render={({ field, fieldState: { error } }) => (
        <>
          <Input autoFocus status={error ? 'error' : undefined} placeholder={placeholder} {...field} />
          <p className="text-error">{error?.message}</p>
        </>
      )}
    />
  )
}
