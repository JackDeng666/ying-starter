import { ReactNode } from 'react'
import { Button, Form } from 'antd'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { Control, Controller, Path } from 'react-hook-form'

type TRegister = (name: string) => { error?: string; value: string; onChange: (val: unknown) => void }

type FormListProps<T, TField extends Path<T>> = {
  control: Control<T>
  name: TField
  label: string
  children: (register: TRegister) => ReactNode
}

export const FormList = <T, TField extends Path<T>>({ control, name, label, children }: FormListProps<T, TField>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        if (field.value === null) {
          field.onChange(undefined)
        }

        if (field.value && !Array.isArray(field.value)) {
          throw new Error(`FormList字段数据类型必须为数组，${name}不是数组`)
        }

        const values = field.value as unknown[]
        const getRegister = (index: number): TRegister => {
          return (name: string) => {
            const value = values.find((_, i) => i === index)
            return {
              error: fieldState.error?.[index]?.[name]?.message,
              value: value[name],
              onChange: val => {
                value[name] = val
                field.onChange(values)
              }
            }
          }
        }
        return (
          <Form.Item label={label}>
            {values?.map((_, index) => (
              <div key={index}>
                {children(getRegister(index))}
                <Form.Item>
                  <Button
                    className="w-full"
                    type="dashed"
                    onClick={() => {
                      field.onChange(values.filter((_, i) => i !== index))
                    }}
                    icon={<DeleteOutlined />}
                  >
                    删除
                  </Button>
                </Form.Item>
              </div>
            ))}
            <Button
              className="w-full"
              type="dashed"
              onClick={() => {
                const newValue = values ? values : []
                newValue.push({})
                field.onChange(newValue)
              }}
              icon={<PlusOutlined />}
            >
              添加
            </Button>
          </Form.Item>
        )
      }}
    />
  )
}
