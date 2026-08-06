import { Card, Spin } from 'antd'
import Chart from '@/components/chart/chart'
import useChart from '@/components/chart/useChart'
import { SvgIcon } from '@/components/icon'

type TotalCardProps = {
  title: string
  increase: boolean
  percent: string
  count: string
  categories: string[]
  chartData: number[]
  loading?: boolean
}

export function TotalCard({ title, increase, count, percent, categories, chartData, loading }: TotalCardProps) {
  const series = [
    {
      name: '',
      data: chartData
    }
  ]
  const chartOptions = useChart({
    xaxis: {
      tooltip: {
        enabled: false
      },
      type: 'category',
      categories: categories
    },
    yaxis: {
      labels: {
        show: false
      },
      tooltip: {
        enabled: false
      },
      crosshairs: {
        show: false
      }
    },
    grid: {
      show: false
    }
  })

  return (
    <Card
      title={title}
      variant="borderless"
      type="inner"
      extra={
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-bold">{count}</h3>
          <div className="flex flex-col items-center">
            {increase ? (
              <SvgIcon icon="rise" size={24} color="rgb(34, 197, 94)" />
            ) : (
              <SvgIcon icon="decline" size={24} color="rgb(255, 86, 48)" />
            )}
            <div className="-mt-1">
              <span>{increase ? '+' : '-'}</span>
              <span>{percent}</span>
            </div>
          </div>
        </div>
      }
    >
      <Spin spinning={loading}>
        <Chart type="line" series={series} options={chartOptions} height={160} />
      </Spin>
    </Card>
  )
}
