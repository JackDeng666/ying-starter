import { createInstance } from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { initReactI18next } from 'react-i18next'
import { createIsomorphicFn } from '@tanstack/react-start'
import { getRequestUrl } from '@tanstack/react-start/server'
import { strMatchArr } from '@/utils'

import { fallbackLng, getOptions, languagesWithSlashes } from './config'

export async function createI18nInstance(lng: string = fallbackLng) {
  const i18nInstance = createInstance()
  await i18nInstance
    .use(resourcesToBackend((language: string, ns: string) => import(`./locales/${language}/${ns}.json`)))
    .use(initReactI18next)
    .init(getOptions(lng))
  return i18nInstance
}

function getMatchLng(pathname: string) {
  const matched = strMatchArr(pathname, languagesWithSlashes, 'startsWith')
  return matched?.split('/')[1]
}

export const getLang = createIsomorphicFn()
  .server(() => {
    const { pathname } = getRequestUrl()
    return getMatchLng(pathname)
  })
  .client(() => {
    const { pathname } = window.location
    return getMatchLng(pathname)
  })
