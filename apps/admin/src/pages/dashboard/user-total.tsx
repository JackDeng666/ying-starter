import { useMemo } from 'react'
import dayjs from 'dayjs'
import { useQuery } from '@tanstack/react-query'

import { userApi } from '@/api'

import { TotalCard } from './total-card'
import { FORMAT_STR } from './constant'

export function UserTotal() {
  const date = useMemo(
    () => [dayjs().add(-6, 'd').startOf('d').format(FORMAT_STR), dayjs().endOf('D').format(FORMAT_STR)],
    []
  )

  const { data: total, isFetching: totalLoading } = useQuery({
    queryKey: ['user-growth-total'],
    queryFn: userApi.getUserGrowthTotal,
    staleTime: 10 * 1000
  })

  const { data: trendData, isFetching: trendDataLoading } = useQuery({
    queryKey: ['user-growth-trend-all', date],
    queryFn: () => userApi.getUserGrowthTrendAll({ date, type: 'day' }),
    staleTime: 10 * 1000
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
    <TotalCard
      title="用户总数和近七日增长"
      increase={current >= prev}
      percent={percent}
      count={total ? String(total) : '0'}
      categories={trendData?.categories || ['', '']}
      chartData={chartData}
      loading={totalLoading || trendDataLoading}
    />
  )
}
