import i18n from 'i18next'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { headers, cookies } from 'next/headers'
import { AppKey } from '@/client/enum'
import { locales, defaultLocale } from './config'
import { resources } from './locales'

i18n.init({
  supportedLngs: locales,
  fallbackLng: defaultLocale,
  fallbackNS: 'basic',
  defaultNS: 'basic',
  ns: 'basic',
  resources
})

export function getFixedT(lng?: string, ns?: string) {
  return {
    t: i18n.getFixedT(lng || '', ns),
    i18n
  }
}

export function getLocale() {
  const cookie = cookies()

  const cookieLng = cookie.get(AppKey.CookieLanguageKey)?.value

  if (cookieLng) return cookieLng

  const languages = new Negotiator({
    headers: { 'accept-language': headers().get('accept-language') || undefined }
  }).languages()

  return match(languages, locales, defaultLocale)
}
