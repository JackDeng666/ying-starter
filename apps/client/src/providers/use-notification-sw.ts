import { useCallback, useEffect, useRef } from 'react'
import type { PushSubscription } from 'web-push'

import { useVisitorStore } from '@/store/visitor-store'
import { commonAPI } from '@/api'

const vapidPublicKey = import.meta.env.APP_VAPID_PUBLIC_KEY

const registerSw = async (onReady: (registration: ServiceWorkerRegistration) => void) => {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.register('/notification-sw.js', { scope: '/notification' })
    await registration.update() // Attempt to update, this operation does not use the cache by default.

    let serviceWorker: ServiceWorker | undefined
    if (registration.installing) {
      serviceWorker = registration.installing
    } else if (registration.waiting) {
      serviceWorker = registration.waiting
    } else if (registration.active) {
      serviceWorker = registration.active
    }

    console.log('Current service worker: ', serviceWorker)
    if (!serviceWorker) return
    if (serviceWorker.state === 'activated') {
      onReady(registration)
    } else {
      serviceWorker.addEventListener('statechange', () => {
        console.log('Service worker statechange: ', serviceWorker.state)
        if (serviceWorker.state === 'activated') {
          onReady(registration)
        }
      })
    }
  } else {
    console.error('Service worker are not supported.')
  }
}

type RegistrationOptions = {
  registration: ServiceWorkerRegistration
  applicationServerKey: string
  visitorId: string
}

const subscribe = async ({ registration, applicationServerKey, visitorId }: RegistrationOptions) => {
  console.log('start subscribe.')
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey
  })

  const pushSubscription = subscription.toJSON() as PushSubscription
  console.log('subscription:', pushSubscription)

  await commonAPI.subscribe({
    visitorId,
    pushSubscription
  })
  console.log('subscribe end.')
}

const checkSubscribe = async (options: RegistrationOptions) => {
  try {
    const { registration } = options
    console.log('start check subscribe')
    const permission = await Notification.requestPermission()
    console.log('permission:', permission)
    if (permission === 'granted') {
      const existSubscription = await registration.pushManager.getSubscription()
      if (existSubscription) {
        const applicationServerKey = existSubscription.options.applicationServerKey
        if (applicationServerKey) {
          const currentKey = btoa(
            String.fromCharCode.apply(null, new Uint8Array(applicationServerKey) as unknown as number[])
          )
            .replaceAll('+', '-')
            .replaceAll('/', '_')
            .replaceAll('=', '')

          if (currentKey !== options.applicationServerKey) {
            console.log('New public key update.')
            await existSubscription.unsubscribe()
            subscribe(options)
          }
        }
      } else {
        subscribe(options)
      }
    } else {
      console.log('The user refused to receive notifications.')
    }
  } catch (error) {
    console.log('Subscribe error:', error)
  }
}

export const useNotificationSw = () => {
  const visitorId = useVisitorStore(store => store.visitorId)
  const initedRef = useRef(false)
  const registrationRef = useRef<ServiceWorkerRegistration>(null)

  useEffect(() => {
    registerSw(registration => {
      registrationRef.current = registration
    })
  }, [])

  const startSubscribe = useCallback(() => {
    if (initedRef.current || !registrationRef.current || !vapidPublicKey || !visitorId) return
    initedRef.current = true

    checkSubscribe({
      registration: registrationRef.current,
      applicationServerKey: vapidPublicKey,
      visitorId
    })
  }, [visitorId])

  return {
    startSubscribe
  }
}
