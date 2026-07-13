import { TimeRangePickerProps } from 'antd'
import dayjs from 'dayjs'

export const FORMAT_STR = 'YYYY-MM-DD HH:mm:ss'

export function getPreset() {
  const rangePresets: TimeRangePickerProps['presets'] = [
    { label: '最近一周', value: [dayjs().add(-6, 'd').startOf('D'), dayjs().endOf('D')] },
    { label: '最近两周', value: [dayjs().add(-13, 'd').startOf('D'), dayjs().endOf('D')] },
    { label: '最近一个月', value: [dayjs().add(-29, 'd').startOf('D'), dayjs().endOf('D')] }
  ]

  return rangePresets
}
