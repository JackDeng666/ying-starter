'use client'

import * as React from 'react'
import { LuCheck, LuClipboard } from 'react-icons/lu'

import { copyText } from '@ying/fontend-shared/utils'

import { cn } from '@/client/lib/utils'
import { Button, ButtonProps } from '@/client/components/ui/button'

interface CopyButtonProps extends ButtonProps {
  value: string
  src?: string
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
        copyText(value)
        setHasCopied(true)
      }}
      {...props}
    >
      <span className="sr-only">Copy</span>
      {hasCopied ? <LuCheck /> : <LuClipboard />}
    </Button>
  )
}
