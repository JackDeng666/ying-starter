import i18n from 'i18next'
import { initReactI18next, useTranslation } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { locales, defaultLocale } from './config'
import { resources } from './locales'
import { useSearchParams } from 'next/navigation'

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
      order: ['querystring', 'htmlTag', 'cookie', 'navigator'],
      lookupQuerystring: 'lng'
    },
    resources
  })

export function useTranslate(ns?: string, options: { keyPrefix?: string; lng?: string } = {}) {
  const searchParams = useSearchParams()
  const lng = searchParams.get('lng')

  return useTranslation(ns, { lng, ...options })
}
