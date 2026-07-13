import { useEffect } from 'react'
import { load } from '@fingerprintjs/fingerprintjs'
import UAParser from 'ua-parser-js'

import type { UserEntity } from '@ying/entity'

import { commonAPI } from '@/api'
import { useVisitorStore } from '@/store/visitor-store'
import { useAuthStore } from '@/store/auth-store'

const DeviceTypes = ['windows', 'android', 'ios', 'mac os']

async function initVisitor() {
  const fp = await load()
  const visitorId = (await fp.get()).visitorId

  useVisitorStore.setState({ visitorId })

  const parser = new UAParser()
  const deviceType = parser.getOS().name?.toLowerCase() || 'others'
  await commonAPI.createVisitor({
    visitorId,
    languages: Array.from(navigator.languages),
    userAgent: navigator.userAgent,
    deviceType: DeviceTypes.includes(deviceType) ? deviceType : 'others'
  })
}

async function bindUser(visitorId: string) {
  await commonAPI.bindUser(visitorId)
}

function isUserNewDevice(user: UserEntity, visitorId: string) {
  return !user.visitors?.some(el => el.visitorId === visitorId)
}

export const useVisitor = () => {
  const { hasHydrated, visitorId } = useVisitorStore()
  const userInfo = useAuthStore(state => state.userInfo)

  useEffect(() => {
    if (hasHydrated && !visitorId) {
      initVisitor()
    }

    if (userInfo && visitorId && isUserNewDevice(userInfo, visitorId)) {
      bindUser(visitorId)
    }
  }, [hasHydrated, visitorId])
}
