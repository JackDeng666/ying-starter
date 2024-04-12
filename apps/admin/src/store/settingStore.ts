import { create } from 'zustand'

import { storage } from '@ying/utils'

import { StorageEnum, ThemeColorPresets, ThemeLayout, ThemeMode } from '@/types/enum'

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

const useSettingStore = create<SettingStore>(set => ({
  settings: storage.getItem<SettingsType>(StorageEnum.Settings) || {
    themeColorPresets: ThemeColorPresets.Default,
    themeMode: ThemeMode.Light,
    themeLayout: ThemeLayout.Vertical,
    themeStretch: true,
    breadCrumb: true,
    multiTab: true
  },
  actions: {
    setSettings: settings => {
      set({ settings })
      storage.setItem(StorageEnum.Settings, settings)
    },
    clearSettings() {
      storage.removeItem(StorageEnum.Settings)
    }
  }
}))

export const useSettings = () => useSettingStore(state => state.settings)
export const useSettingActions = () => useSettingStore(state => state.actions)
