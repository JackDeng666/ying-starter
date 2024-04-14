import * as i18n from 'i18next'
import Negotiator from 'negotiator'
import { match } from '@formatjs/intl-localematcher'

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

export { i18n }

export function getLocale(headers: Negotiator.Headers) {
  const languages = new Negotiator({ headers }).languages()

  return match(languages, locales, defaultLocale)
}
