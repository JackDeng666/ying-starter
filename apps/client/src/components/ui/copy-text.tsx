import { cn } from '@/client/lib/utils'
import { ClassNameProps } from '@/client/types'
import { CopyButton } from '@/client/components/ui/copy-button'

interface CopyTextProps extends ClassNameProps {
  value: string
}

export const CopyText = ({ className, value }: CopyTextProps) => {
  return (
    <div
      className={cn(
        'border flex items-center justify-between gap-4 px-3 py-1.5 rounded-md shadow-sm text-base bg-background',
        className
      )}
    >
      {value}
      <CopyButton value={value} />
    </div>
  )
}
