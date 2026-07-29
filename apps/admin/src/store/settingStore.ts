import { create } from 'zustand'

import { storage } from '@ying/frontend/utils'

import { StorageEnum, ThemeColorPresets, ThemeNavLayout, ThemeMode } from '@/types/enum'
import { colorPresets } from '@/theme/antd/config'

type SettingsType = {
  themeColorPresets: ThemeColorPresets
  themeMode: ThemeMode
  themeLayout: ThemeNavLayout
  themeStretch: boolean
  breadCrumb: boolean
  multiTab: boolean
}
type SettingStore = {
  settings: SettingsType
}

const useSettingStore = create<SettingStore>(() => {
  const settings = storage.getItem<SettingsType>(StorageEnum.Settings) ?? {
    themeColorPresets: ThemeColorPresets.Purple,
    themeMode: ThemeMode.Light,
    themeLayout: ThemeNavLayout.Vertical,
    themeStretch: true,
    breadCrumb: true,
    multiTab: true
  }

  document.documentElement.classList.add(settings.themeMode)

  const colorPrimary = colorPresets[settings.themeColorPresets]
  document.documentElement.style.setProperty('--primary', colorPrimary)

  return {
    settings
  }
})

export const useSettings = () => useSettingStore(state => state.settings)

export const setSettings = (settings: SettingsType) => {
  useSettingStore.setState({ settings })
  storage.setItem(StorageEnum.Settings, settings)

  const colorPrimary = colorPresets[settings.themeColorPresets]
  document.documentElement.style.setProperty('--primary', colorPrimary)

  document.documentElement.classList.remove(ThemeMode.Light, ThemeMode.Dark)
  document.documentElement.classList.add(settings.themeMode)
}
