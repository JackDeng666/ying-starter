'use client'

import { useRouter } from '@/client/store/app-store'
import { cn } from '@/client/lib/utils'

type LinkProps = {
  href: string
  className?: string
  children: React.ReactNode
}

export const Link = ({ href, className, children, ...props }: LinkProps) => {
  const router = useRouter()

  return (
    <a
      className={cn(
        'relative inline-flex items-center tap-highlight-transparent outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 text-foreground no-underline hover:opacity-80 active:opacity-disabled text-[length:inherit] cursor-pointer',
        className
      )}
      onClick={() => {
        if (href) router.push(href)
      }}
    >
      {children}
    </a>
  )
}
