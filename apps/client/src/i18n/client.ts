import i18n from 'i18next'
import { initReactI18next, useTranslation } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { useAppContext } from '@/client/components/app-provider'
import { AppKey } from '@/client/enum'
import { locales, defaultLocale } from './config'
import { resources } from './locales'
import map from './locales/zh/index'

type Keys = keyof typeof map

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    supportedLngs: locales,
    fallbackLng: defaultLocale,
    fallbackNS: 'basic',
    defaultNS: 'basic',
    ns: 'basic',
    detection: {
      order: ['cookie', 'navigator'],
      lookupCookie: AppKey.CookieLanguageKey
    },
    resources
  })

export function useTranslate(ns?: Keys, options: { keyPrefix?: string; lng?: string } = {}) {
  const { lng } = useAppContext()

  return useTranslation(ns, { lng, ...options })
}
