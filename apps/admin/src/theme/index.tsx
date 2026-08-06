import { useEffect, useState, type PropsWithChildren } from 'react'
import { ConfigProvider, theme, ThemeConfig } from 'antd'
import locale from 'antd/es/locale/zh_CN'

import { useSettings } from '@/store'
import { ThemeMode } from '@/types/enum'

import { initCustomThemeTokenConfig, customComponentConfig, colorPresets } from './config'

export default function AntdConfig({ children }: PropsWithChildren) {
  const { themeMode, themeColorPresets } = useSettings()
  const [customThemeTokenConfig, setCustomThemeTokenConfig] = useState<ThemeConfig['token']>()

  const algorithm = themeMode === ThemeMode.Light ? theme.defaultAlgorithm : theme.darkAlgorithm
  const colorPrimary = colorPresets[themeColorPresets]

  useEffect(() => {
    setCustomThemeTokenConfig(initCustomThemeTokenConfig())
  }, [themeMode])

  return (
    <ConfigProvider
      locale={locale}
      theme={{
        token: {
          colorPrimary,
          ...customThemeTokenConfig
        },
        components: {
          ...customComponentConfig
        },
        algorithm
      }}
    >
      {children}
    </ConfigProvider>
  )
}
