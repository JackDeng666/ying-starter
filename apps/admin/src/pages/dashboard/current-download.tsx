import { Card } from 'antd'

import Chart from '@/admin/components/chart/chart'
import useChart from '@/admin/components/chart/useChart'

export default function CurrentDownload() {
  return (
    <Card title="Current Download" bordered={false} type="inner">
      <ChartDonut />
    </Card>
  )
}

const series = [44, 55, 13, 43]

function ChartDonut() {
  const chartOptions = useChart({
    labels: ['Mac', 'Window', 'IOS', 'Android'],
    stroke: {
      show: false
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center'
    },
    tooltip: {
      fillSeriesColor: false
    },
    chart: {
      width: 240
    },
    plotOptions: {
      pie: {
        donut: {
          size: '90%',
          labels: {
            total: {
              fontSize: '12px'
            },
            value: {
              fontSize: '18px',
              fontWeight: 700
            }
          }
        }
      }
    }
  })

  return <Chart type="donut" series={series} options={chartOptions} height={240} />
}
