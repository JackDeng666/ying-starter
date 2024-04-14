import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function replaceState() {
  let url = window.location.href
  if (url.indexOf('?') !== -1) {
    url = url.replace(/(\?|#)[^'"]*/, '') //去除参数
    window.history.replaceState({}, '', url)
  }
}
