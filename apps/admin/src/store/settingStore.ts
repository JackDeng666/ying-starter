import { create } from 'zustand'

import { storage } from '@ying/frontend/utils'

import { StorageEnum, ThemeColorPresets, ThemeLayout, ThemeMode } from '@/types/enum'
import { colorPresets } from '@/theme/antd/config'

type SettingsType = {
  themeColorPresets: ThemeColorPresets
  themeMode: ThemeMode
  themeLayout: ThemeLayout
  themeStretch: boolean
  breadCrumb: boolean
  multiTab: boolean
}
type SettingStore = {
  settings: SettingsType
  // 使用 actions 命名空间来存放所有的 action
  actions: {
    setSettings: (settings: SettingsType) => void
    clearSettings: () => void
  }
}

const useSettingStore = create<SettingStore>(set => {
  const settings = storage.getItem<SettingsType>(StorageEnum.Settings) || {
    themeColorPresets: ThemeColorPresets.Purple,
    themeMode: ThemeMode.Light,
    themeLayout: ThemeLayout.Vertical,
    themeStretch: true,
    breadCrumb: true,
    multiTab: true
  }

  document.documentElement.classList.add(settings.themeMode)

  const colorPrimary = colorPresets[settings.themeColorPresets]
  document.documentElement.style.setProperty('--primary', colorPrimary)

  return {
    settings,
    actions: {
      setSettings: settings => {
        set({ settings })
        storage.setItem(StorageEnum.Settings, settings)

        const colorPrimary = colorPresets[settings.themeColorPresets]
        document.documentElement.style.setProperty('--primary', colorPrimary)

        document.documentElement.classList.remove(ThemeMode.Light, ThemeMode.Dark)
        document.documentElement.classList.add(settings.themeMode)
      },
      clearSettings() {
        storage.removeItem(StorageEnum.Settings)
      }
    }
  }
})

export const useSettings = () => useSettingStore(state => state.settings)
export const useSettingActions = () => useSettingStore(state => state.actions)
