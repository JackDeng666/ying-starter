import { Radio } from 'antd'
import type { RadioGroupProps } from 'antd/lib/radio'
import { clientLanguagesConfig, type LngKeys } from '@ying/shared'

type IntlSwitchProps = Omit<RadioGroupProps, 'value' | 'onChange'> & {
  className?: string
  value: LngKeys
  onChange: (val: LngKeys) => void
}
export const IntlSwitch = ({
  optionType = 'button',
  buttonStyle = 'solid',
  className,
  value,
  onChange,
  ...props
}: IntlSwitchProps) => {
  return (
    <Radio.Group
      className={className}
      optionType={optionType}
      buttonStyle={buttonStyle}
      options={clientLanguagesConfig.languages}
      value={value}
      onChange={e => onChange(e.target.value)}
      {...props}
    />
  )
}
