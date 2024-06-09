import { useEffect, useTransition } from 'react'
import { create } from 'zustand'
import { useRouter as useNextRouter } from 'next/navigation'
import { NavigateOptions } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { initApi, AuthApi, FileApi, UserApi } from '@/client/api/client'
import { useAppContext } from '@/client/providers/app'

type API = {
  authApi?: AuthApi
  fileApi?: FileApi
  userApi?: UserApi
}

type AppStore = {
  apiIninted: boolean
  api: API
  isPending: boolean
}

export const useAppStore = create<AppStore>(() => ({
  apiIninted: false,
  api: {},
  isPending: false
}))

export const useAppPending = () => useAppStore(state => state.isPending)

const setApi = (api: API) => {
  useAppStore.setState({ apiIninted: true, api })
}

export const useApi = () => {
  const appContext = useAppContext()
  const state = useAppStore()

  if (!state.apiIninted) {
    setApi(initApi(appContext))
  }

  return state.api
}

export const useRouter = () => {
  const [isPending, startTransiton] = useTransition()
  const router = useNextRouter()

  function push(href: string, options?: NavigateOptions) {
    startTransiton(() => router.push(href, options))
  }

  function replace(href: string, options?: NavigateOptions) {
    startTransiton(() => router.replace(href, options))
  }

  function refresh() {
    startTransiton(() => router.refresh())
  }

  useEffect(() => {
    useAppStore.setState({ isPending })

    return () => {
      useAppStore.setState({ isPending: false })
    }
  }, [isPending])

  return {
    push,
    replace,
    refresh
  }
}
