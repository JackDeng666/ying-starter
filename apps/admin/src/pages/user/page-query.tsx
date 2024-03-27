import { FC } from 'react'
import { Control, Controller } from 'react-hook-form'
import { Button, Form, Input, DatePicker } from 'antd'
import dayjs from 'dayjs'
import { ListUserDto } from '@shared'

const { RangePicker } = DatePicker

type PageQueryProps = {
  control: Control<ListUserDto>
  reset: () => void
  children?: React.ReactNode
}

export const PageQuery: FC<PageQueryProps> = ({ control, reset, children }) => {
  return (
    <div className="mb-4 w-full flex flex-wrap gap-2">
      <Form.Item<ListUserDto> label="昵称" className="!mb-0">
        <Controller
          name="name"
          control={control}
          render={({ field }) => <Input allowClear placeholder="请输入昵称" autoComplete="off" {...field} />}
        />
      </Form.Item>

      <Form.Item label="邮箱" className="!mb-0">
        <Controller
          name="email"
          control={control}
          render={({ field }) => <Input allowClear placeholder="请输入邮箱" autoComplete="off" {...field} />}
        />
      </Form.Item>

      <Form.Item label="创建时间" className="!mb-0">
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <RangePicker
              value={field.value ? [dayjs(field.value[0]), dayjs(field.value[1])] : undefined}
              onChange={(_, formatString) => {
                if (!formatString.join('')) return field.onChange(undefined)
                field.onChange(formatString)
              }}
            />
          )}
        />
      </Form.Item>

      <div className="flex-1 flex justify-end gap-2">
        <Button onClick={() => reset()}>重置</Button>
        {children}
      </div>
    </div>
  )
}
