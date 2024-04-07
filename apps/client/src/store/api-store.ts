import { create } from 'zustand'
import { initApi, AuthApi, FileApi, UserApi } from '@/api/client'
import { useAppContext } from '@/components/app-provider'

type API = {
  authApi?: AuthApi
  fileApi?: FileApi
  userApi?: UserApi
}

interface ApiStore {
  ininted: boolean
  api: API
}

export const useApiStore = create<ApiStore>(() => ({
  ininted: false,
  api: {}
}))

const setApi = (api: API) => {
  useApiStore.setState({ ininted: true, api })
}

export const useApi = () => {
  const { apiUrl, domain } = useAppContext()
  const state = useApiStore()

  if (!state.ininted) {
    setApi(initApi(apiUrl, domain))
  }

  return state.api
}
