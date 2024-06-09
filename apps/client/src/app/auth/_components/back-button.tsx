'use client'

import { Button } from '@/client/components/ui/button'
import { Link } from '@/client/components/link'

interface BackButtonProps {
  href: string
  label: string
}

export const BackButton = ({ href, label }: BackButtonProps) => {
  return (
    <Button variant="ghost" className="font-normal w-full text-sm" size="sm">
      <Link href={href}>{label}</Link>
    </Button>
  )
}
