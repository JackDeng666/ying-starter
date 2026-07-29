import { ColumnsType } from 'antd/es/table'
import { formatNumber } from '@ying/utils'

export const getTableX = <T>(columns?: ColumnsType<T>, ...reset: (string | number)[]) => {
  const columnsWidth = columns?.reduce<number>(
    (prev, cur) => prev + (Number(formatNumber.fNumber(cur.width)) || cur.minWidth || 0),
    0
  )
  const otherWidth = reset.reduce<number>((prev, cur) => prev + Number(formatNumber.fNumber(cur)), 0)
  return columnsWidth + otherWidth
}
