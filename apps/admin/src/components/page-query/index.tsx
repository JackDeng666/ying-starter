import { Button, Form, DatePicker } from 'antd'
import { Control, Controller, UseFormReset } from 'react-hook-form'
import dayjs from 'dayjs'

import { ListDto } from '@ying/shared'

const { RangePicker } = DatePicker

type PageQueryProps = {
  control: Control<ListDto>
  reset: UseFormReset<ListDto>
  children?: React.ReactNode
  extras?: React.ReactNode
}

export const PageQuery = ({ control, reset, children, extras }: PageQueryProps) => {
  return (
    <div className="mb-4 w-full flex flex-wrap gap-2">
      {children}
      <Form.Item label="创建时间" className="!mb-0">
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <RangePicker
              value={field.value ? [dayjs(field.value[0]), dayjs(field.value[1])] : undefined}
              onChange={date => {
                if (!date) return field.onChange(undefined)
                field.onChange([
                  date[0].startOf('D').format('YYYY-MM-DD HH:mm:ss'),
                  date[1].endOf('D').format('YYYY-MM-DD HH:mm:ss')
                ])
              }}
            />
          )}
        />
      </Form.Item>

      <div className="flex-1 flex justify-end gap-2">
        <Button onClick={() => reset()}>重置</Button>
        {extras}
      </div>
    </div>
  )
}
