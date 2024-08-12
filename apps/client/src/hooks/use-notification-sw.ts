import { useCallback, useEffect, useRef } from 'react'
import type { PushSubscription } from 'web-push'

import { useApi } from '@/client/store/app-store'
import { useVisitorStore } from '@/client/store/visitor-store'
import { useAppContext } from '@/client/providers/app'

export const useNotificationSw = () => {
  const { serverUrl, vapidPublicKey } = useAppContext()
  const { commonApi } = useApi()
  const visitor = useVisitorStore(store => store.visitor)
  const initedRef = useRef(false)

  const subscribe = useCallback(
    async (registration: ServiceWorkerRegistration) => {
      if (!commonApi || !vapidPublicKey || !visitor) return
      console.log('start subscribe')
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidPublicKey
      })

      const pushSubscription = subscription.toJSON() as PushSubscription
      console.log('subscription:', pushSubscription)

      commonApi.subscribe({
        visitorId: visitor.id,
        pushSubscription
      })
    },
    [vapidPublicKey, visitor, commonApi]
  )

  const checkSubscribe = useCallback(
    async (registration: ServiceWorkerRegistration) => {
      if (registration.active) {
        registration.active.postMessage({
          type: 'SET_APP_API_URL',
          data: { key: 'apiUrl', data: serverUrl + '/api/client' }
        })
      }
      try {
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

              if (currentKey !== vapidPublicKey) {
                console.log('New vapid public key update.')
                await existSubscription.unsubscribe()
                subscribe(registration)
              }
            }
          } else {
            subscribe(registration)
          }
        } else {
          console.log('The user refused to receive notifications.')
        }
      } catch (error) {
        console.log('Subscribe error:', error)
      }
    },
    [vapidPublicKey, subscribe, serverUrl]
  )

  const registerSw = useCallback(async () => {
    if (initedRef.current || !vapidPublicKey || !visitor) return
    initedRef.current = true
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.register('/notification-sw.js', { scope: '/notification' })
      await registration.update() // 尝试更新，此操作默认不会使用缓存

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
        checkSubscribe(registration)
      } else {
        serviceWorker.addEventListener('statechange', () => {
          console.log('Service worker statechange: ', serviceWorker.state)
          if (serviceWorker.state === 'activated') {
            checkSubscribe(registration)
          }
        })
      }
    } else {
      console.error('Service worker are not supported.')
    }
  }, [checkSubscribe, vapidPublicKey, visitor])

  useEffect(() => {
    registerSw()
  }, [registerSw])

  return {
    checkSubscribe
  }
}
