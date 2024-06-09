import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import 'nprogress/nprogress.css'

import { AppProvider } from '@/client/providers/app'
import { CustomNavbar } from '@/client/components/navbar'
import { Footer } from '@/client/components/footer'
import { getLocale, getFixedT } from '@/client/i18n/server'
import { LayoutProps } from '@/client/types'

import './globals.css'

export async function generateMetadata(): Promise<Metadata> {
  const lng = getLocale()

  const { t } = getFixedT(lng)

  return {
    title: t('App Title'),
    description: t('App Title')
  }
}

export default function RootLayout({ children }: LayoutProps) {
  const apiUrl = process.env.API_URL
  const domain = process.env.DOMAIN
  const accessTokenExpiresIn = process.env.AUTH_EXPIRES_IN
  const refreshTokenExpiresIn = process.env.AUTH_REFRESH_EXPIRES_IN
  if (!apiUrl) return new Error('API_URL missing')
  if (!domain) return new Error('DOMAIN missing')
  if (!accessTokenExpiresIn) return new Error('AUTH_EXPIRES_IN missing')
  if (!refreshTokenExpiresIn) return new Error('AUTH_REFRESH_EXPIRES_IN missing')

  const lng = getLocale()

  return (
    <html lang="en">
      <body className="font-sans min-h-screen flex flex-col">
        <AppProvider
          value={{
            apiUrl,
            domain,
            accessTokenExpiresIn,
            refreshTokenExpiresIn,
            lng
          }}
        >
          <Toaster position="top-center" richColors />
          <CustomNavbar />
          <div className="flex-1 flex flex-col bg-secondary">{children}</div>
          <Footer />
        </AppProvider>
      </body>
    </html>
  )
}
