import type { PropsWithChildren } from 'react'
import { StyleProvider } from '@ant-design/cssinjs'
import { ConfigProvider, theme } from 'antd'
import locale from 'antd/es/locale/zh_CN'

import { useSettings } from '@/store/settingStore'
import { ThemeMode } from '@/types/enum'

import { customThemeTokenConfig, customComponentConfig, colorPresets } from './config'

export default function AntdConfig({ children }: PropsWithChildren) {
  const { themeMode, themeColorPresets } = useSettings()

  const algorithm = themeMode === ThemeMode.Light ? theme.defaultAlgorithm : theme.darkAlgorithm
  const colorPrimary = colorPresets[themeColorPresets]

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
      {/* https://ant.design/docs/react/compatible-style-cn#styleprovider */}
      <StyleProvider hashPriority="high">{children}</StyleProvider>
    </ConfigProvider>
  )
}
