import { Spin } from 'antd'
import { cn } from '@/admin/utils/lib'

export function CircleLoading({ className }: { className?: string }) {
  return (
    <div className={cn('flex h-full w-full items-center justify-center', className)}>
      <Spin size="large" />
    </div>
  )
}
