import type { Metadata } from 'next'
import { Toaster } from 'sonner'

import { ImageProvider } from '@/components/image-provider'
import './globals.css'
import { getLocale, getFixedT } from '@/i18n/server'

export async function generateMetadata(): Promise<Metadata> {
  const lng = getLocale()

  const { t } = getFixedT(lng)

  return {
    title: t('App Title'),
    description: t('App Title')
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="h-screen bg-background font-sans antialiased">
        <Toaster position="top-center" richColors />
        <ImageProvider>{children}</ImageProvider>
      </body>
    </html>
  )
}
