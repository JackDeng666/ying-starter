import { useRef, useState } from 'react'
import { Input } from 'antd'
import type { InputProps } from 'antd/lib/input'

import { clientLanguagesConfig, type LngKeys, type TIntlText } from '@ying/shared'

import { IntlSwitch } from './intl-switch'

const { fallbackLng, languages } = clientLanguagesConfig

type IntlInputProps = Omit<InputProps, 'defaultValue' | 'onChange'> & {
  defaultValue?: TIntlText
  onChange?: (val: TIntlText) => void
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const IntlInput = ({ value, defaultValue, onChange, ...props }: IntlInputProps) => {
  const [currentLng, setCurrentLng] = useState<LngKeys>(fallbackLng)
  const intlText = useRef<TIntlText>(defaultValue ?? {})

  return (
    <>
      <IntlSwitch value={currentLng} onChange={setCurrentLng} />
      {languages.map(
        lng =>
          currentLng === lng && (
            <Input
              {...props}
              key={lng}
              defaultValue={intlText.current?.[lng]}
              onChange={e => {
                intlText.current[lng] = e.target.value
                onChange?.(intlText.current)
              }}
            />
          )
      )}
    </>
  )
}
