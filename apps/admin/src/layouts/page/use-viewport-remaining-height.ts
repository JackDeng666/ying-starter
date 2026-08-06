import { useThemeToken } from '@/hooks'
import { useSettings } from '@/store'
import { NAV_HORIZONTAL_HEIGHT, HEADER_HEIGHT, MULTI_TABS_HEIGHT } from '@/layouts/dashboard/constant'
import { ThemeNavLayout } from '@/types/enum'

export const useViewportRemainingHeight = () => {
  const { padding } = useThemeToken()
  const { themeLayout, multiTab } = useSettings()
  let height = HEADER_HEIGHT + (themeLayout === ThemeNavLayout.Horizontal ? NAV_HORIZONTAL_HEIGHT : 0)
  height = height + (multiTab ? MULTI_TABS_HEIGHT : 0)
  return height + padding * 2
}
