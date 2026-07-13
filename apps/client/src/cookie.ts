import { createIsomorphicFn } from '@tanstack/react-start'
import {
  setCookie as serverSetCookie,
  getCookie as serverGetCookie,
  deleteCookie as serverRemoveCookie
} from '@tanstack/react-start/server'
import Cookie from 'js-cookie'

export const setCookie = createIsomorphicFn()
  .server((name: string, value: string) => {
    return serverSetCookie(name, value)
  })
  .client((name: string, value: string) => {
    return Cookie.set(name, value)
  })

export const getCookie = createIsomorphicFn()
  .server((name: string) => {
    return serverGetCookie(name)
  })
  .client((name: string) => {
    return Cookie.get(name)
  })

export const removeCookie = createIsomorphicFn()
  .server((name: string) => {
    return serverRemoveCookie(name)
  })
  .client((name: string) => {
    return Cookie.remove(name)
  })
