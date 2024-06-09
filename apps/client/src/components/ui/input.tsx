import * as React from 'react'

import { CloseIcon } from '@/client/components/ui/icons'
import { cn } from '@/client/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  clearable?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, clearable, ...props }, ref) => {
  const clear = () => {
    if (props.disabled) return
    props.onChange && props.onChange('' as unknown as React.ChangeEvent<HTMLInputElement>)
  }

  return (
    <div className="relative">
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-md border border-input bg-input/30 hover:bg-input/60 px-3 pr-5 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
      <CloseIcon
        className={cn(
          'h-9 absolute right-1 top-0 cursor-pointer opacity-100 transition-opacity',
          props.disabled && 'opacity-50 cursor-not-allowed',
          !(clearable && props.value) && 'opacity-0'
        )}
        onClick={clear}
      />
    </div>
  )
})
Input.displayName = 'Input'

export { Input }
