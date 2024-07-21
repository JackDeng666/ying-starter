import * as React from 'react'

import { CloseIcon } from '@/client/components/ui/icons'
import { cn } from '@/client/lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  clearable?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, clearable, ...props }, ref) => {
  const clear = () => {
    if (props.disabled) return
    props.onChange && props.onChange('' as unknown as React.ChangeEvent<HTMLTextAreaElement>)
  }

  return (
    <div className="relative">
      <textarea
        className={cn(
          'flex min-h-[60px] w-full rounded-md border border-input bg-input/30 hover:bg-input/60 px-3 pr-5 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
      <CloseIcon
        className={cn(
          ' absolute right-1 top-1 cursor-pointer opacity-100 transition-opacity',
          props.disabled && 'opacity-0 cursor-not-allowed',
          !(clearable && props.value) && 'opacity-0'
        )}
        onClick={clear}
      />
    </div>
  )
})
Textarea.displayName = 'Textarea'

export { Textarea }
