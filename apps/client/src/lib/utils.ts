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

export function pathMatchArr(path: string, arr: string[], macthFunc: 'startsWith' | 'endsWith') {
  for (let i = 0; i < arr.length; i++) {
    const el = arr[i]
    if (path[macthFunc](el)) {
      return el
    }
  }
}
