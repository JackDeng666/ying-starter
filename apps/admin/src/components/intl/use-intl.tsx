import { useEffect, useRef, useState } from 'react'
import { Radio } from 'antd'
import type { SizeType } from 'antd/lib/config-provider/SizeContext'

import { clientLanguagesConfig, TIntlText } from '@ying/shared/config'

type UseIntlOptions = {
  value: TIntlText
  radioSize?: SizeType
}

export const useIntl = ({ value, radioSize }: UseIntlOptions) => {
  const inited = useRef(false)

  const [lng, setLng] = useState(clientLanguagesConfig.fallbackLng)

  const [intlValue, setIntlValue] = useState<TIntlText>(value || {})

  const [currentShowValue, setCurrentShowValue] = useState(intlValue[lng])

  useEffect(() => {
    setIntlValue(value || {})

    if (value && !inited.current) {
      setCurrentShowValue(value[lng])
      inited.current = true
    }
  }, [value, lng])

  return {
    lng,
    setLng,
    intlValue,
    currentShowValue,
    setCurrentShowValue,
    radioContent: (
      <Radio.Group
        className="whitespace-normal !mb-2"
        options={clientLanguagesConfig.languages}
        optionType="button"
        buttonStyle="solid"
        size={radioSize}
        value={lng}
        onChange={e => {
          setLng(e.target.value)
          setCurrentShowValue(intlValue[e.target.value])
        }}
      />
    )
  }
}
