import { ThemeConfig } from 'antd'

import { ThemeColorPresets } from '@/types/enum'
/**
 * Antd theme editor: https://ant.design/theme-editor-cn
 */
const customThemeTokenConfig: ThemeConfig['token'] = {
  colorSuccess: '#22c55e',
  colorWarning: '#ff7849',
  colorError: '#ff5630',

  // 线性化
  wireframe: false,

  borderRadiusSM: 2,
  borderRadius: 4,
  borderRadiusLG: 8
}

const customComponentConfig: ThemeConfig['components'] = {
  Menu: {
    // fontSize: 14
    // colorFillAlter: 'transparent'
    // itemColor: 'rgb(145, 158, 171)'
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
