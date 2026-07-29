import { Drawer } from 'antd'
import Color from 'color'
import { CSSProperties } from 'react'

import { useDialogOpen } from '@ying/frontend/hooks'

import { IconButton, SvgIcon } from '@/components/icon'
import Logo from '@/components/logo'
import { useSettings } from '@/store'
import { useThemeToken } from '@/theme/hooks'
import { ThemeNavLayout } from '@/types/enum'

import AccountDropdown from '../_common/account-dropdown'
import BreadCrumb from '../_common/bread-crumb'
import SearchBar from '../_common/search-bar'
import SettingButton from '../_common/setting-button'

import { HEADER_HEIGHT } from './constant'
import { NavVertical } from './nav'

export function Header() {
  const drawerProps = useDialogOpen()
  const { themeLayout, breadCrumb } = useSettings()
  const { colorBgElevated, colorBorder } = useThemeToken()

  const headerStyle: CSSProperties = {
    width: '100%',
    borderBottom: `1px dashed ${Color(colorBorder).alpha(0.6).toString()}`,
    backgroundColor: Color(colorBgElevated).alpha(1).toString()
  }

  return (
    <>
      <header className="z-20 w-full" style={headerStyle}>
        <div
          className="flex grow items-center justify-between text-gray backdrop-blur px-4 xl:px-6 2xl:px-10"
          style={{
            height: HEADER_HEIGHT
          }}
        >
          <div className="flex items-center">
            {themeLayout !== ThemeNavLayout.Horizontal ? (
              <IconButton onClick={() => drawerProps.onOpen(true)} className="h-10 w-10 md:hidden">
                <SvgIcon icon="ic-menu" size="24" />
              </IconButton>
            ) : (
              <Logo className="mr-4 text-xl" />
            )}
            <div className="hidden md:block">{breadCrumb ? <BreadCrumb /> : null}</div>
          </div>

          <div className="flex items-center gap-x-2">
            <SearchBar />
            <SettingButton />
            <AccountDropdown />
          </div>
        </div>
      </header>
      <Drawer
        placement="left"
        width="auto"
        styles={{
          header: { display: 'none' },
          body: { padding: 0, overflow: 'hidden' }
        }}
        closeIcon={false}
        {...drawerProps}
      >
        <NavVertical show onMenuClick={() => drawerProps.onClose()} />
      </Drawer>
    </>
  )
}
