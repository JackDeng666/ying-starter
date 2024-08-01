'use client'

import { useMemo, useState } from 'react'
import Cookies from 'js-cookie'
import { useParams, usePathname } from 'next/navigation'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/client/components/ui/select'
import { languages } from '@/client/i18n/config'
import { useTranslate } from '@/client/i18n/client'
import { AppKey } from '@/client/enum'
import { useRouter } from '@/client/store/app-store'
import { useAppContext } from '@/client/providers/app'

export const SwitchLanguage = () => {
  const { lng } = useParams()
  const pathname = usePathname()
  const { domain } = useAppContext()
  const translation = useTranslate()
  const router = useRouter()
  const [currentLng, setCurrentLng] = useState(lng as string)

  const lngs = useMemo(() => languages.map(l => ({ label: translation.t(l), value: l })), [translation])

  function selectLanguage(changeLng: string) {
    setCurrentLng(changeLng)
    Cookies.set(AppKey.CookieLanguageKey, changeLng, { domain, expires: 365 })
    router.replace(pathname.replace(`/${lng}`, `/${changeLng}`))
    router.refresh()
  }

  return (
    <Select onValueChange={selectLanguage} defaultValue={currentLng} value={currentLng}>
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
