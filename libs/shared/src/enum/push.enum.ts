export enum RegisterType {
  All = 'all',
  Register = 'register',
  UnRegister = 'unregister'
}

export enum DeviceType {
  All = 'all',
  Windows = 'windows',
  Android = 'android',
  Ios = 'ios',
  MacOs = 'mac os',
  Others = 'others'
}

export enum PushTaskStatus {
  Wait,
  WaitExecute,
  Executing,
  Done
}

export enum PushRecordStatus {
  Pushing,
  Success,
  Fail
}
