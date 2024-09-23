import { useEffect } from 'react'
import { Tooltip } from 'antd'

import { TIntlText } from '@ying/shared/config'

import { useIntl } from './use-intl'

type IntlShowProps = {
  value?: TIntlText
}

export const IntlShow = ({ value }: IntlShowProps) => {
  const { lng, currentShowValue, setCurrentShowValue, radioContent } = useIntl({ value, radioSize: 'small' })

  useEffect(() => {
    if (!value) return
    setCurrentShowValue(value[lng])
  }, [setCurrentShowValue, value, lng])

  if (!value) return null

  return (
    <>
      {radioContent}
      <br />
      <Tooltip title={<div className="truncate whitespace-pre-wrap">{currentShowValue}</div>} placement="topLeft">
        <div className="truncate whitespace-pre-wrap">{currentShowValue}</div>
      </Tooltip>
    </>
  )
}
