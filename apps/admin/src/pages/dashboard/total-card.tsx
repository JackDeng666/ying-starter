import Chart from '@/admin/components/chart/chart'
import useChart from '@/admin/components/chart/useChart'
import { SvgIcon } from '@/admin/components/icon'
import { Card } from 'antd'

type Props = {
  title: string
  increase: boolean
  percent: string
  count: string
  chartData: number[]
}
export default function TotalCard({ title, increase, count, percent, chartData }: Props) {
  return (
    <Card title={title} bordered={false} type="inner">
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

        <ChartLine data={chartData} />
      </div>
    </Card>
  )
}

function ChartLine({ data }: { data: number[] }) {
  const series = [
    {
      name: '',
      data
    }
  ]
  const chartOptions = useChart({
    tooltip: {
      x: {
        show: false
      }
    },
    xaxis: {
      labels: {
        show: false,
        showDuplicates: false
      },
      tooltip: {
        enabled: false
      },
      crosshairs: {
        show: false
      }
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

  return <Chart type="line" series={series} options={chartOptions} width={120} />
}
