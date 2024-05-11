'use client'

import { LayoutProps } from '@/client/types'
import { Navbar } from './navbar'

export const CardWrapper = ({ children }: LayoutProps) => {
  return (
    <div className="w-full sm:w-[540px] flex-1 sm:flex-none sm:min-h-[540px] rounded-none sm:rounded-lg shadow-lg flex flex-col bg-white">
      <Navbar />
      {children}
    </div>
  )
}
