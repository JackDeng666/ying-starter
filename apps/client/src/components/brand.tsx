import { Link } from '@/client/components/link'
import { ClassNameProps } from '@/client/types'
import { cn } from '@/client/lib/utils'

export const Brand = ({ className }: ClassNameProps) => {
  return (
    <Link className={cn('flex z-40 font-semibold text-gray-950', className)} href="/">
      <span className="text-primary">Ying</span>Starter
    </Link>
  )
}
