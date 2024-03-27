'use client'

import { useEffect } from 'react'
import { LayoutProps } from '@/types'

export const ImageProvider = ({ children }: LayoutProps) => {
  useEffect(() => {
    document.addEventListener(
      'error',
      function (e) {
        const target = e.target
        if (target instanceof HTMLImageElement) {
          if (target.srcset !== '/not-found.jpg') {
            target.srcset = '/not-found.jpg'
          }
        }
      },
      true
    )
  }, [])

  return children
}
