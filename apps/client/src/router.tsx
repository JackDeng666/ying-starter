import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { createI18nInstance, getLang } from '@/i18n'
import { routeTree } from './routeTree.gen'

export async function getRouter() {
  const i18n = await createI18nInstance(getLang())
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    context: {
      i18n
    }
  })
  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
