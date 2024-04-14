import { memo } from 'react'
import ApexChart from 'react-apexcharts'

import { useSettings } from '@/admin/store/settingStore'
import { useThemeToken } from '@/admin/theme/hooks'

import { StyledApexChart } from './styles'

import type { Props as ApexChartProps } from 'react-apexcharts'

export default memo(function Chart(props: ApexChartProps) {
  const { themeMode } = useSettings()
  const theme = useThemeToken()
  return (
    <StyledApexChart $thememode={themeMode} $theme={theme}>
      <ApexChart {...props} />
    </StyledApexChart>
  )
})
