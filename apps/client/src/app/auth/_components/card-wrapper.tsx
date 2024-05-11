'use client'

import { Card, CardHeader, CardFooter } from '@nextui-org/react'
import { Header } from './header'
import { Social } from './social'
import { BackButton } from './back-button'

interface CardWrapperProps {
  children: React.ReactNode
  headerLabel: string
  backButtonLabel?: string
  backButtonHref?: string
  showSocial?: boolean
}

export const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial
}: CardWrapperProps) => {
  return (
    <Card className="w-full sm:w-[400px] flex-1 sm:flex-none rounded-none sm:rounded-lg shadow-md">
      <CardHeader className="px-6 pt-6">
        <Header label={headerLabel} />
      </CardHeader>
      <div className="px-6 py-0">{children}</div>
      <CardFooter className="px-6 pb-4 flex-col gap-2">
        {showSocial && <Social />}
        {backButtonLabel && backButtonHref && <BackButton label={backButtonLabel} href={backButtonHref} />}
      </CardFooter>
    </Card>
  )
}
