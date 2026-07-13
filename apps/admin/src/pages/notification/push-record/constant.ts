import { PresetColorType, PresetStatusColorType } from 'antd/es/_util/colors'
import { LiteralUnion } from 'antd/es/_util/type'
import { PushRecordStatus } from '@ying/shared'

export type PushRecordStatusOption = {
  value: PushRecordStatus
  label: string
  color: LiteralUnion<PresetColorType | PresetStatusColorType>
}

export const PushRecordStatusOptions: PushRecordStatusOption[] = [
  {
    value: PushRecordStatus.Pushing,
    label: '推送中',
    color: 'cyan'
  },
  {
    value: PushRecordStatus.Success,
    label: '推送成功',
    color: 'success'
  },
  {
    value: PushRecordStatus.Fail,
    label: '推送失败',
    color: 'red'
  }
]
