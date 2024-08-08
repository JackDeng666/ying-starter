import { DeviceType } from '@ying/shared'

export type DeviceTypeOption = { value: DeviceType; label: string }

export const DeviceTypeOptions: DeviceTypeOption[] = [
  {
    value: DeviceType.Windows,
    label: 'windows'
  },
  {
    value: DeviceType.Android,
    label: 'android'
  },
  {
    value: DeviceType.Ios,
    label: 'ios'
  },
  {
    value: DeviceType.MacOs,
    label: 'mac os'
  },
  {
    value: DeviceType.Others,
    label: '其他'
  }
]
