import { BaseType } from 'antd/es/typography/Base'
import { BasicStatus, PermissionType } from '@ying/shared'
import { PresetStatusColorType } from 'antd/es/_util/colors'

export type TypeOption = {
  label: string
  value: number
}

export type BasicStatusOptionsType = TypeOption & {
  value: BasicStatus
  color: BaseType
}

export const BasicStatusOptions: BasicStatusOptionsType[] = [
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

export type PermissionOptionsType = TypeOption & {
  value: PermissionType
  color: PresetStatusColorType
}

export const PermissionOptions: PermissionOptionsType[] = [
  {
    value: PermissionType.CATALOGUE,
    color: 'success',
    label: '目录'
  },
  {
    value: PermissionType.MENU,
    color: 'processing',
    label: '菜单'
  },
  {
    value: PermissionType.BUTTON,
    color: 'default',
    label: '按钮'
  }
]

export const IframeLink = '/iframe/index.tsx'

export const ExternalLink = '/iframe/external-link.tsx'
