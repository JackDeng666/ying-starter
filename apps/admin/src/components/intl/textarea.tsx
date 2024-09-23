import { forwardRef } from 'react'
import { Input } from 'antd'
import type { TextAreaProps } from 'antd/lib/input'

import { TIntlText } from '@ying/shared/config'
import { useIntl } from './use-intl'

type IntlTextAreaProps = Omit<TextAreaProps, 'value' | 'onChange'> & {
  value?: TIntlText
  onChange?: (val: TIntlText) => void
}

export const IntlTextArea = forwardRef(({ value, onChange, ...props }: IntlTextAreaProps, ref) => {
  const { lng, intlValue, currentShowValue, setCurrentShowValue, radioContent } = useIntl({ value })

  return (
    <>
      {radioContent}
      <Input.TextArea
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
