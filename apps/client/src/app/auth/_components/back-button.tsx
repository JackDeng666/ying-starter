'use client'

import Link from 'next/link'

import { Button } from '@nextui-org/react'

interface BackButtonProps {
  href: string
  label: string
}

export const BackButton = ({ href, label }: BackButtonProps) => {
  return (
    <Button variant="light" className="font-normal w-full" size="sm">
      <Link href={href}>{label}</Link>
    </Button>
  )
}
