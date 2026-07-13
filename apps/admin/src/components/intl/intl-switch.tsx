import { Radio } from 'antd'
import type { RadioGroupProps } from 'antd/lib/radio'
import { clientLanguagesConfig, type LngKeys } from '@ying/shared'
import { cn } from '@ying/frontend/ui'

type IntlSwitchProps = Pick<RadioGroupProps, 'size' | 'optionType' | 'buttonStyle'> & {
  value: LngKeys
  onChange: (val: LngKeys) => void
  className?: string
}
export const IntlSwitch = ({
  size,
  optionType = 'button',
  buttonStyle = 'solid',
  value,
  onChange,
  className
}: IntlSwitchProps) => {
  return (
    <Radio.Group
      size={size}
      optionType={optionType}
      buttonStyle={buttonStyle}
      options={clientLanguagesConfig.languages}
      value={value}
      onChange={e => onChange(e.target.value)}
      className={cn('whitespace-normal mb-2!', className)}
    />
  )
}
