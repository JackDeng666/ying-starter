'use client'

import { useCallback, useEffect, useState } from 'react'
import Cookies from 'js-cookie'

import { storage } from '@ying/utils'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/client/components/ui/select'
import { locales } from '@/client/i18n/config'
import { useTranslate } from '@/client/i18n/client'
import { AppKey } from '@/client/enum'
import { useRouter } from '@/client/store/app-store'
import { useAppContext } from '@/client/providers/app'

export const SwitchLanguage = () => {
  const { domain, lng } = useAppContext()
  const { t } = useTranslate()
  const router = useRouter()
  const [currentLocale, setCurrentLocale] = useState(lng)

  const lngs = locales.map(local => ({ label: t(local), value: local }))

  function selectLanguage(lng: string) {
    setCurrentLocale(lng)
    storage.setStringItem(AppKey.CookieLanguageKey, lng)
    Cookies.set(AppKey.CookieLanguageKey, lng, { domain, expires: 365 })
    router.refresh()
  }

  const checkLanguage = useCallback(() => {
    const storageLng = storage.getStringItem(AppKey.CookieLanguageKey)
    const cookieLng = Cookies.get(AppKey.CookieLanguageKey)

    if (storageLng && !cookieLng) {
      Cookies.set(AppKey.CookieLanguageKey, storageLng, { domain, expires: 365 })
    }
  }, [domain])

  useEffect(() => {
    checkLanguage()
  }, [checkLanguage])

  return (
    <Select onValueChange={selectLanguage} defaultValue={currentLocale}>
      <SelectTrigger className="w-[150px]">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        {lngs.map(item => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
