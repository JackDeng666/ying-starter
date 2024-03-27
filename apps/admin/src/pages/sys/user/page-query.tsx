import { FC } from 'react'
import { Control, Controller } from 'react-hook-form'
import { Button, Form, Input, DatePicker, Select, Typography } from 'antd'
import dayjs from 'dayjs'
import { BasicStatusOptions } from '@/constant'

const { RangePicker } = DatePicker

type PageQueryProps = {
  control: Control
  reset: () => void
  children?: React.ReactNode
}

export const PageQuery: FC<PageQueryProps> = ({ control, reset, children }) => {
  return (
    <div className="mb-4 w-full flex flex-wrap gap-2">
      <Form.Item label="名称" className="!mb-0">
        <Controller
          name="name"
          control={control}
          render={({ field }) => <Input allowClear placeholder="名称" autoComplete="off" {...field} />}
        />
      </Form.Item>

      <Form.Item label="账号" className="!mb-0">
        <Controller
          name="account"
          control={control}
          render={({ field }) => <Input allowClear placeholder="账号" autoComplete="off" {...field} />}
        />
      </Form.Item>

      <Form.Item label="状态" className="!mb-0">
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select style={{ width: 120 }} placeholder="选择状态" allowClear {...field}>
              {BasicStatusOptions.map(el => (
                <Select.Option value={el.value} key={el.value}>
                  <Typography.Text type={el.color}>{el.label}</Typography.Text>
                </Select.Option>
              ))}
            </Select>
          )}
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
