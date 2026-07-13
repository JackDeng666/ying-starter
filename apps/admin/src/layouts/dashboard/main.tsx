import { CSSProperties, forwardRef } from 'react'
import { Outlet } from 'react-router-dom'

import { useSettings } from '@/store/settingStore'
import { useResponsive, useThemeToken } from '@/theme/hooks'
import { ThemeLayout } from '@/types/enum'

import { NAV_WIDTH, NAV_COLLAPSED_WIDTH, HEADER_HEIGHT, MULTI_TABS_HEIGHT } from './config'
import MultiTabs from './multi-tabs'

type Props = {
  offsetTop?: boolean
}
const Main = forwardRef<HTMLDivElement, Props>(({ offsetTop = false }, ref) => {
  const themeToken = useThemeToken()

  const { themeStretch, themeLayout, multiTab } = useSettings()
  const { screenMap } = useResponsive()

  const mainStyle: CSSProperties = {
    paddingTop: HEADER_HEIGHT + (multiTab ? MULTI_TABS_HEIGHT : 0),
    width: '100%',
    backgroundColor: themeToken.colorBgContainerDisabled
  }
  if (themeLayout === ThemeLayout.Horizontal) {
    mainStyle.width = '100vw'
    mainStyle.paddingTop = multiTab ? MULTI_TABS_HEIGHT : 0
  } else if (screenMap.md) {
    mainStyle.width = `calc(100% - ${themeLayout === ThemeLayout.Vertical ? NAV_WIDTH : NAV_COLLAPSED_WIDTH})`
  } else {
    mainStyle.width = '100vw'
  }

  return (
    <div ref={ref} style={mainStyle} className="flex flex-auto flex-col overflow-auto">
      <div className={`m-auto w-full h-full grow ${themeStretch ? '' : 'xl:max-w-screen-xl'}`}>
        <div className="p-4">{multiTab ? <MultiTabs offsetTop={offsetTop} /> : <Outlet />}</div>
      </div>
    </div>
  )
})

export default Main
