import { useScroll } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useSettings } from '@/store/settingStore'
import { useThemeToken } from '@/theme/hooks'
import { ThemeLayout } from '@/types/enum'

import Header from './header'
import Main from './main'
import Nav from './nav'
import NavHorizontal from './nav-horizontal'

function DashboardLayout() {
  const { colorBgElevated, colorTextBase } = useThemeToken()
  const { themeLayout } = useSettings()

  const mainEl = useRef(null)
  const { scrollY } = useScroll({ container: mainEl })
  /**
   * y轴是否滚动
   */
  const [offsetTop, setOffsetTop] = useState(false)
  const onOffSetTop = useCallback(() => {
    scrollY.on('change', scrollHeight => {
      if (scrollHeight > 0) {
        setOffsetTop(true)
      } else {
        setOffsetTop(false)
      }
    })
  }, [scrollY])

  useEffect(() => {
    onOffSetTop()
  }, [onOffSetTop])

  const verticalLayout = (
    <>
      <Header offsetTop={offsetTop} />
      <div className="z-50 hidden h-full shrink-0 md:block">
        <Nav />
      </div>
      <Main ref={mainEl} offsetTop={offsetTop} />
    </>
  )

  const horizontalLayout = (
    <div className="relative flex flex-1 flex-col">
      <Header />
      <NavHorizontal />
      <Main ref={mainEl} offsetTop={offsetTop} />
    </div>
  )

  const layout = themeLayout !== ThemeLayout.Horizontal ? verticalLayout : horizontalLayout

  return (
    <div
      className="flex h-screen w-screen overflow-hidden"
      style={{
        color: colorTextBase,
        background: colorBgElevated,
        transition: 'color 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, background 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'
      }}
    >
      {layout}
    </div>
  )
}
export default DashboardLayout
