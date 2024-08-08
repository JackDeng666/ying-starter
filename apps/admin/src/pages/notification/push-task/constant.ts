import { CreatePushTaskDto, RegisterType, DeviceType, PushTaskStatus } from '@ying/shared'

export const defaultValues: CreatePushTaskDto = {
  name: undefined,
  registerType: RegisterType.All,
  deviceType: DeviceType.All,
  pushTemplateId: undefined
}

export type RegisterTypeOption = { value: RegisterType; label: string }

export const RegisterTypeOptions: RegisterTypeOption[] = [
  {
    value: RegisterType.All,
    label: '全部用户'
  },
  {
    value: RegisterType.Register,
    label: '注册用户'
  },
  {
    value: RegisterType.UnRegister,
    label: '未注册用户'
  }
]

export type DeviceTypeOption = { value: DeviceType; label: string }

export const DeviceTypeOptions: DeviceTypeOption[] = [
  {
    value: DeviceType.All,
    label: '全部设备'
  },
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

export type PushTaskStatusOption = { value: PushTaskStatus; label: string }

export const PushTaskStatusOptions: PushTaskStatusOption[] = [
  {
    value: PushTaskStatus.Wait,
    label: '待设置'
  },
  {
    value: PushTaskStatus.WaitExecute,
    label: '待执行'
  },
  {
    value: PushTaskStatus.Executing,
    label: '执行中'
  },
  {
    value: PushTaskStatus.Done,
    label: '已结束'
  }
]
