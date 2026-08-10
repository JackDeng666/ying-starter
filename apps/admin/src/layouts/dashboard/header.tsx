import { Logo } from '@/components/logo'
import { useSettings } from '@/store'
import { ThemeNavLayout } from '@/types/enum'
import { useResponsive } from '@/hooks'
import { AccountDropdown } from '../_common/account-dropdown'
import { BreadCrumb } from '../_common/bread-crumb'
import { SearchBar } from '../_common/search-bar'
import { Settings } from '../_common/settings'
import { HEADER_HEIGHT, NAV_WIDTH, NAV_COLLAPSED_WIDTH } from './constant'
import { NavDrawer } from './nav'

export function Header() {
  const { themeLayout, breadCrumb, navCollapsed } = useSettings()
  const { screenMap } = useResponsive()
  const isVertical = themeLayout === ThemeNavLayout.Vertical
  const isLogoFull = isVertical && screenMap.md && !navCollapsed

  return (
    <header
      className="z-20 shrink-0 w-full border-b border-border flex items-center justify-between text-gray px-4"
      style={{
        height: HEADER_HEIGHT
      }}
    >
      <div className="flex items-center">
        {isVertical && <NavDrawer />}
        <Logo
          className="text-xl justify-center"
          style={{
            transition: 'width 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
            width: isLogoFull ? `calc(${NAV_WIDTH}px - var(--spacing) * 4 * 2)` : NAV_COLLAPSED_WIDTH,
            marginRight: isLogoFull ? 'calc(var(--spacing) * 8)' : 'calc(var(--spacing) * 4)'
          }}
        />
        {breadCrumb && <BreadCrumb className="hidden sm:block" />}
      </div>
      <div className="flex items-center gap-x-2">
        <SearchBar />
        <Settings />
        <AccountDropdown />
      </div>
    </header>
  )
}
