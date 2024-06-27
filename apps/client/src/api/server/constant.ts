export const API_URL = process.env.SERVER_URL + '/api/client'

export type ResOrError<T> = {
  status: number
  message: string | string[]
  data?: T
  timestamp?: string
  path?: string
  [key: string]: unknown
}
