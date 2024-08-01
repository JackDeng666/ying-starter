import { createInstance, i18n } from 'i18next'
import I18nResourcesToBackend from 'i18next-resources-to-backend'
import { headers, cookies } from 'next/headers'
import acceptLanguage from 'accept-language'
import { AppKey } from '@/client/enum'
import { languages, fallbackLng, getOptions } from './config'

acceptLanguage.languages(languages)

export function getLocale() {
  let lng: string | undefined | null = acceptLanguage.get(cookies().get(AppKey.CookieLanguageKey)?.value)
  if (!lng) lng = acceptLanguage.get(headers().get('Accept-Language'))
  if (!lng) lng = fallbackLng
  return lng
}

let i18nInstance: i18n | undefined

const getI18n = async (lng?: string, ns?: string) => {
  if (i18nInstance) return i18nInstance
  i18nInstance = createInstance()
  const LocalBackend = I18nResourcesToBackend((lng: string, ns: string) => import(`./locales/${lng}/${ns}.json`))
  await i18nInstance.use(LocalBackend).init(getOptions(lng, ns))
  return i18nInstance
}

export async function getServerTranslation(lng: string, ns?: string, options: { keyPrefix?: string } = {}) {
  const i18n = await getI18n(lng, ns)
  return {
    t: i18n.getFixedT(lng, Array.isArray(ns) ? ns[0] : ns, options.keyPrefix),
    i18n
  }
}
