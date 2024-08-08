import { useCallback, useMemo } from 'react'
import { Spin } from 'antd'
import dayjs from 'dayjs'

import { delyFunc } from '@ying/utils'
import { useFetch } from '@ying/fontend-shared/hooks'

import { userApi } from '@/admin/api'

import { TotalCard } from './total-card'
import { FORMAT_STR } from './constant'

const getUserGrowthTotal = delyFunc(userApi.getUserGrowthTotal, 500)
const getUserGrowthTrendAll = delyFunc(userApi.getUserGrowthTrendAll, 500)

export function UserTotal() {
  const date = useMemo(
    () => [dayjs().add(-6, 'd').startOf('d').format(FORMAT_STR), dayjs().endOf('D').format(FORMAT_STR)],
    []
  )

  const { data: total, loading: totalLoading } = useFetch({
    func: useCallback(() => getUserGrowthTotal(), [])
  })

  const { data: trendData, loading: trendDataLoading } = useFetch({
    func: useCallback(() => getUserGrowthTrendAll({ date, type: 'day' }), [date])
  })

  const chartData = trendData?.list || [0, 0]

  const prev = chartData[chartData.length - 2]
  const current = chartData[chartData.length - 1]

  let percent = '0'
  if (current !== 0) {
    if (prev !== 0) {
      percent = ((Math.abs(current - prev) / prev) * 100).toFixed(2) + '%'
    } else if (prev === 0) {
      percent = '100%'
    }
  } else {
    if (prev !== 0) {
      percent = '100%'
    } else {
      percent = '0%'
    }
  }

  return (
    <Spin spinning={totalLoading || trendDataLoading}>
      <TotalCard
        title="用户总数和近七日增长"
        increase={current >= prev}
        percent={percent}
        count={total ? String(total) : '0'}
        categories={trendData?.categories || ['', '']}
        chartData={chartData}
      />
    </Spin>
  )
}
