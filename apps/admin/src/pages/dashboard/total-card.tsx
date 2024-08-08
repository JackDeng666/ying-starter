import { Card } from 'antd'
import Chart from '@/admin/components/chart/chart'
import useChart from '@/admin/components/chart/useChart'
import { SvgIcon } from '@/admin/components/icon'

type Props = {
  title: string
  increase: boolean
  percent: string
  count: string
  categories: string[]
  chartData: number[]
}

export function TotalCard({ title, increase, count, percent, categories, chartData }: Props) {
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
    <Card title={title} bordered={false} type="inner" className="!mb-4">
      <div className="flex">
        <div className="flex-grow">
          <div className="mb-2 mt-4 flex flex-row">
            {increase ? (
              <SvgIcon icon="ic_rise" size={24} color="rgb(34, 197, 94)" />
            ) : (
              <SvgIcon icon="ic_decline" size={24} color="rgb(255, 86, 48)" />
            )}
            <div className="ml-2">
              <span>{increase ? '+' : '-'}</span>
              <span>{percent}</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold">{count}</h3>
        </div>

        <Chart type="line" series={series} options={chartOptions} height={80} />
      </div>
    </Card>
  )
}
