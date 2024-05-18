'use client'

import { Link as NextUILink, LinkProps } from '@nextui-org/react'
import { useRouter } from '@/client/store/app-store'
import { cn } from '@/client/lib/utils'

export const Link = ({ href, className, children, ...props }: LinkProps) => {
  const router = useRouter()
  return (
    <NextUILink
      color="foreground"
      className={cn('text-[length:inherit]', className)}
      onClick={() => {
        if (href) router.push(href)
      }}
      {...props}
    >
      {children}
    </NextUILink>
  )
}
