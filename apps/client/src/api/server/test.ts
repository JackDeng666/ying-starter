import { serverFetch } from './fetch'

export const getData = async () => {
  return serverFetch('/xx')
}
