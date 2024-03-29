import i18n from 'i18next'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { headers } from 'next/headers'
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
    t: i18n.getFixedT(lng, ns),
    i18n
  }
}

export function getLocale() {
  const languages = new Negotiator({ headers: { ['accept-language']: headers().get('accept-language') } }).languages()

  return match(languages, locales, defaultLocale)
}
