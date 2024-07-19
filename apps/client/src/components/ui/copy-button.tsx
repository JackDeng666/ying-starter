'use client'

import * as React from 'react'
import { LuCheck, LuClipboard } from 'react-icons/lu'

import { cn } from '@/client/lib/utils'
import { Button, ButtonProps } from '@/client/components/ui/button'

interface CopyButtonProps extends ButtonProps {
  value: string
  src?: string
}

export async function copyToClipboardWithMeta(value: string) {
  navigator.clipboard.writeText(value)
}

export function CopyButton({ value, className, src, variant = 'outline', ...props }: CopyButtonProps) {
  const [hasCopied, setHasCopied] = React.useState(false)

  React.useEffect(() => {
    setTimeout(() => {
      setHasCopied(false)
    }, 2000)
  }, [hasCopied])

  return (
    <Button
      size="icon"
      variant={variant}
      className={cn('relative h-8 w-8', className)}
      onClick={() => {
        copyToClipboardWithMeta(value)
        setHasCopied(true)
      }}
      {...props}
    >
      <span className="sr-only">Copy</span>
      {hasCopied ? <LuCheck /> : <LuClipboard />}
    </Button>
  )
}
