import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import 'nprogress/nprogress.css'

import { AppProvider } from '@/client/providers/app'
import { CustomNavbar } from '@/client/components/navbar'
import { Footer } from '@/client/components/footer'
import { PageSpyScript } from '@/client/components/page-spy-script'
import { getServerTranslation } from '@/client/i18n/server'
import { BasicParams, LayoutProps } from '@/client/types'
import { fallbackLng, languages } from '@/client/i18n/config'

import './globals.css'

export async function generateStaticParams() {
  return languages.map(lng => ({ lng }))
}

export async function generateMetadata({ params: { lng } }: { params: BasicParams }): Promise<Metadata> {
  const { t } = await getServerTranslation(lng)

  return {
    title: t('app_title')
  }
}

export default async function RootLayout({ children, params }: LayoutProps) {
  const lng = params?.lng || fallbackLng
  const serverUrl = process.env.SERVER_URL
  const domain = process.env.DOMAIN
  const accessTokenExpiresIn = process.env.AUTH_EXPIRES_IN
  const refreshTokenExpiresIn = process.env.AUTH_REFRESH_EXPIRES_IN
  const pageSpyUrl = process.env.PAGE_SPY_URL
  const pageSpyProject = process.env.PAGE_SPY_PROJECT
  const vapidPublicKey = process.env.VAPID_PUBLIC_KEY

  if (!serverUrl) return new Error('SERVER_URL missing')
  if (!domain) return new Error('DOMAIN missing')
  if (!accessTokenExpiresIn) return new Error('AUTH_EXPIRES_IN missing')
  if (!refreshTokenExpiresIn) return new Error('AUTH_REFRESH_EXPIRES_IN missing')

  return (
    <html lang={lng}>
      <body className="font-sans">
        <AppProvider
          value={{
            serverUrl,
            domain,
            accessTokenExpiresIn,
            refreshTokenExpiresIn,
            pageSpyUrl,
            pageSpyProject,
            vapidPublicKey
          }}
        >
          <main className="min-h-screen flex flex-col bg-accent" vaul-drawer-wrapper="">
            <Toaster position="top-center" richColors />
            <CustomNavbar />
            <div className="flex-1 flex flex-col">{children}</div>
            <Footer />
            {pageSpyUrl && <PageSpyScript />}
          </main>
        </AppProvider>
        <div id="draggable"></div>
      </body>
    </html>
  )
}
