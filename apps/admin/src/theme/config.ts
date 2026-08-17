import type { ThemeConfig } from 'antd'

import { ThemeColorPresets } from '@/types/enum'
import { getColors } from './get-colors'

const { success, warning, error, info } = getColors()

/**
 * Antd theme editor: https://ant.design/theme-editor-cn
 */
const customThemeTokenConfig: ThemeConfig['token'] = {
  colorSuccess: success,
  colorWarning: warning,
  colorError: error,
  colorInfo: info
}

const customComponentConfig: ThemeConfig['components'] = {
  Menu: {
    iconSize: 20,
    collapsedIconSize: 20
  },
  Form: {
    itemMarginBottom: 14
  }
}

const colorPresets: {
  [k in ThemeColorPresets]: string
} = {
  default: '#00a76f',
  cyan: '#078DEE',
  purple: '#7635DC',
  blue: '#2065D1',
  orange: '#FDA92D',
  red: '#FF3030'
}

export { customThemeTokenConfig, customComponentConfig, colorPresets }
