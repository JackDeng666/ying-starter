import { useCallback, useEffect, useState } from 'react'
import { load } from '@fingerprintjs/fingerprintjs'
import UAParser from 'ua-parser-js'

import { AppKey } from '@/client/enum'
import { useApi } from '@/client/store/app-store'
import { VisitorEntity } from '@ying/shared/entities'

const DeviceTypes = ['windows', 'android', 'ios', 'mac os']

export const useVisitor = () => {
  const { commonApi } = useApi()
  const [visitor, setVisitor] = useState<VisitorEntity | undefined>()

  const storeVisitor = (newVisitor: VisitorEntity) => {
    localStorage.setItem(AppKey.storageVisitorKey, JSON.stringify(newVisitor))
    setVisitor(newVisitor)
  }

  const initVisitor = useCallback(async () => {
    const storageVisitor = localStorage.getItem(AppKey.storageVisitorKey)
    if (storageVisitor) {
      return setVisitor(JSON.parse(storageVisitor))
    }

    if (!commonApi) return
    const parser = new UAParser()
    const deviceType = parser.getOS().name?.toLowerCase() || 'others'
    const env = {
      language: navigator.language,
      userAgent: navigator.userAgent,
      deviceType: DeviceTypes.includes(deviceType) ? deviceType : 'others'
    }

    const fp = await load()
    const visitorId = (await fp.get()).visitorId

    const newVisitor = await commonApi.createVisitor({ visitorId, ...env })

    storeVisitor(newVisitor)
  }, [commonApi])

  useEffect(() => {
    initVisitor()
  }, [initVisitor])

  return {
    visitor,
    storeVisitor
  }
}
