import { LayoutWithClassProps } from '@/client/types'
import { cn } from '@/client/lib/utils'

export const MaxWidthWrapper = ({ className, children }: LayoutWithClassProps) => {
  return <div className={cn('h-full mx-auto w-full max-w-screen-xl px-2.5 md:px-20', className)}>{children}</div>
}
