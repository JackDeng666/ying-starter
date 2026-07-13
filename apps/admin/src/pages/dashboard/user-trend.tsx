import { useState } from 'react'
import { Card, DatePicker, Spin, Select, Space } from 'antd'
import type { DatePickerProps, TimeRangePickerProps } from 'antd'
import dayjs from 'dayjs'
import { useQuery } from '@tanstack/react-query'

import { userApi } from '@/api'
import Chart from '@/components/chart/chart'
import useChart from '@/components/chart/useChart'

import { FORMAT_STR, getPreset } from './constant'

const { RangePicker } = DatePicker

export function UserTrend() {
  const [type, setType] = useState<'hour' | 'day'>('day')
  const onTypeChange = (value: 'hour' | 'day') => {
    setType(value)
  }

  const [date, setDate] = useState(dayjs())
  const onDateChange: DatePickerProps['onChange'] = date => {
    setDate(date)
  }

  const rangePresets = getPreset()

  const [dateRange, setDateRange] = useState(rangePresets[2].value)
  const onRangeDateChange: TimeRangePickerProps['onChange'] = dates => {
    setDateRange(dates)
  }

  const { data, isFetching: loading } = useQuery({
    queryKey: ['user-growth-trend', type, date, dateRange],
    queryFn: () =>
      userApi.getUserGrowthTrend({
        type,
        date:
          type === 'hour'
            ? [date.startOf('D').format(FORMAT_STR), date.endOf('D').format(FORMAT_STR)]
            : [dateRange[0].format(FORMAT_STR), dateRange[1].format(FORMAT_STR)]
      }),
    staleTime: 10 * 1000
  })

  const series: ApexAxisChartSeries = data?.types || []
  const chartOptions = useChart({
    xaxis: {
      type: 'category',
      categories: data?.categories || []
    }
  })

  return (
    <Card
      title="注册用户增长趋势"
      variant="borderless"
      type="inner"
      styles={{ body: { padding: '10px', paddingBottom: 0 } }}
      extra={
        <Space>
          {type === 'hour' ? (
            <DatePicker allowClear={false} value={date} onChange={onDateChange} />
          ) : (
            <RangePicker allowClear={false} presets={rangePresets} value={dateRange} onChange={onRangeDateChange} />
          )}
          <Select
            style={{ width: 100 }}
            options={[
              { value: 'hour', label: '每小时' },
              { value: 'day', label: '每天' }
            ]}
            value={type}
            onChange={onTypeChange}
          />
        </Space>
      }
    >
      <Spin spinning={loading}>
        <Chart type="area" series={series} options={chartOptions} height={400} />
      </Spin>
    </Card>
  )
}
