import { useCallback, useEffect } from 'react'
import { create } from 'zustand'
import { load } from '@fingerprintjs/fingerprintjs'
import UAParser from 'ua-parser-js'
import { VisitorEntity } from '@ying/shared/entities'
import { AppKey } from '@/client/enum'
import { useApi } from './app-store'

const DeviceTypes = ['windows', 'android', 'ios', 'mac os']

type VisitorStore = {
  visitor: VisitorEntity | undefined
}

export const useVisitorStore = create<VisitorStore>(() => ({
  visitor: undefined
}))

export const setVisitor = (visitor: VisitorEntity) => {
  useVisitorStore.setState({ visitor })
  localStorage.setItem(AppKey.storageVisitorKey, JSON.stringify(visitor))
}

export const useVisitor = () => {
  const { commonApi } = useApi()

  const initVisitor = useCallback(async () => {
    const storageVisitorStr = localStorage.getItem(AppKey.storageVisitorKey)
    if (storageVisitorStr) {
      const storageVisitor: VisitorEntity = JSON.parse(storageVisitorStr)
      setVisitor(storageVisitor)
      return storageVisitor
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
    setVisitor(newVisitor)
    return newVisitor
  }, [commonApi])

  useEffect(() => {
    initVisitor()
  }, [initVisitor])
}
