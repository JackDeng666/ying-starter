import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/client/lib/utils'

const badgeVariants = cva('inline-flex items-center rounded-sm border px-3 py-1 text-sm font-semibold', {
  variants: {
    variant: {
      default: 'border-transparent bg-primary/20 text-primary',
      secondary: 'border-transparent bg-secondary text-secondary-foreground',
      destructive: 'border-transparent bg-destructive/20 text-destructive',
      success: 'border-transparent bg-emerald-500/20 text-emerald-500',
      warning: 'border-transparent bg-yellow-500/20 text-yellow-500',
      outline: 'text-foreground'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
