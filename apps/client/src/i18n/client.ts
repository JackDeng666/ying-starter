import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createInstance, FlatNamespace, KeyPrefix, i18n } from 'i18next'
import I18nResourcesToBackend from 'i18next-resources-to-backend'
import {
  FallbackNs,
  initReactI18next,
  useTranslation as useTranslationOrg,
  UseTranslationOptions,
  UseTranslationResponse
} from 'react-i18next'
import { getOptions } from './config'

const runsOnServerSide = typeof window === 'undefined'

let i18nInstance: i18n | undefined
export function initI18n(lng: string) {
  if (i18nInstance) return
  i18nInstance = createInstance()
  const LocalBackend = I18nResourcesToBackend((lng: string, ns: string) => import(`./locales/${lng}/${ns}.json`))
  i18nInstance.use(LocalBackend).use(initReactI18next).init(getOptions(lng))
}

export function useTranslate<Ns extends FlatNamespace, KPrefix extends KeyPrefix<FallbackNs<Ns>> = undefined>(
  ns?: Ns,
  options?: UseTranslationOptions<KPrefix>
): UseTranslationResponse<FallbackNs<Ns>, KPrefix> {
  const { lng } = useParams()
  const translation = useTranslationOrg(ns, options)
  const { i18n } = translation

  if (runsOnServerSide && lng && i18n.resolvedLanguage !== lng) {
    i18n.changeLanguage(lng as string)
  }

  const [activeLng, setActiveLng] = useState(i18n.resolvedLanguage)
  useEffect(() => {
    if (activeLng === i18n.resolvedLanguage) return
    setActiveLng(i18n.resolvedLanguage)
  }, [activeLng, i18n.resolvedLanguage])
  useEffect(() => {
    if (!lng || i18n.resolvedLanguage === lng) return
    i18n.changeLanguage(lng as string)
  }, [lng, i18n])

  return translation
}
