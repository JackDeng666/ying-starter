import { ReactNode } from 'react'
import { Button, Form } from 'antd'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { ArrayPath, Control, FieldArray, useFieldArray } from 'react-hook-form'

type FormListProps<T, TField extends ArrayPath<T>> = {
  control: Control<T>
  name: TField
  label: string
  children: (index: number) => ReactNode
  defaultValue: FieldArray<T, TField> | FieldArray<T, TField>[]
}

export const FormList = <T, TField extends ArrayPath<T>>({
  control,
  name,
  label,
  children,
  defaultValue
}: FormListProps<T, TField>) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name
  })

  return (
    <Form.Item label={label}>
      {fields.map((field, index) => (
        <div key={field.id}>
          {children(index)}
          <Form.Item>
            <Button className="w-full" type="dashed" icon={<DeleteOutlined />} onClick={() => remove(index)}>
              删除
            </Button>
          </Form.Item>
        </div>
      ))}
      <Button className="w-full" type="dashed" onClick={() => append(defaultValue)} icon={<PlusOutlined />}>
        添加
      </Button>
    </Form.Item>
  )
}
