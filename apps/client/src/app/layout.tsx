import type { Metadata } from 'next'
import { Toaster } from 'sonner'

import { ImageProvider } from '@/client/components/image-provider'
import './globals.css'
import { getLocale, getFixedT } from '@/client/i18n/server'
import { AppProvider } from '@/client/components/app-provider'

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
        <AppProvider
          value={{
            apiUrl: process.env.API_URL!,
            domain: process.env.DOMAIN!,
            authExpiresIn: process.env.AUTH_EXPIRES_IN!
          }}
        >
          <ImageProvider>
            <Toaster position="top-center" richColors />
            {children}
          </ImageProvider>
        </AppProvider>
      </body>
    </html>
  )
}
