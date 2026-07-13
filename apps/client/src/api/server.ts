import { http } from './http-server'

export const articleAPI = await import('./business/article').then(res => res.default(http))
