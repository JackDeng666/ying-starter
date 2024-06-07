import { cn } from '@/admin/utils/lib'

export type ToolButtonProps = {
  className?: string
  children: React.ReactNode
  active?: boolean
  disabled?: boolean
  onClick?: () => void
}

export const ToolButton = ({ className, children, active, disabled, onClick }: ToolButtonProps) => {
  return (
    <div
      className={cn(
        'w-8 h-8 rounded-md p-2 border border-[#f1f1f1] cursor-pointer hover:bg-[#f1f1f1] fc text-base',
        active && 'bg-[#f1f1f1]',
        disabled && 'text-gray hover:bg-transparent hover:cursor-default',
        className
      )}
      onClick={() => {
        if (disabled) return
        onClick && onClick()
      }}
    >
      {children}
    </div>
  )
}
