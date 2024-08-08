import { BaseType } from 'antd/es/typography/Base'

import { BasicStatus } from '@ying/shared'

export type TypeOption = {
  label: string
  value: number | string
}

export type BasicStatusOption = TypeOption & {
  value: BasicStatus
  color: BaseType
}

export const BasicStatusOptions: BasicStatusOption[] = [
  {
    value: BasicStatus.ENABLE,
    color: 'success',
    label: '可用'
  },
  {
    value: BasicStatus.DISABLE,
    color: 'warning',
    label: '禁用'
  }
]

export const IframeLink = '/iframe/index.tsx'

export const ExternalLink = '/iframe/external-link.tsx'
