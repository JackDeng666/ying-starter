import { forwardRef } from 'react'
import { Input } from 'antd'
import type { InputProps } from 'antd/lib/input'

import { TIntlText } from '@ying/shared/config'
import { useIntl } from './use-intl'

type IntlInputProps = Omit<InputProps, 'value' | 'onChange'> & {
  value?: TIntlText
  onChange?: (val: TIntlText) => void
}

export const IntlInput = forwardRef(({ value, onChange, ...props }: IntlInputProps, ref) => {
  const { lng, intlValue, currentShowValue, setCurrentShowValue, radioContent } = useIntl({
    value
  })

  return (
    <>
      {radioContent}
      <Input
        {...props}
        value={currentShowValue}
        onChange={e => {
          setCurrentShowValue(e.target.value)
          onChange({ ...intlValue, [lng]: e.target.value })
        }}
      />
    </>
  )
})
