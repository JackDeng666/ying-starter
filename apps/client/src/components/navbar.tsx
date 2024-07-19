'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { LuLogOut, LuAlignJustify } from 'react-icons/lu'
import NProgress from 'nprogress'

import { Button } from '@/client/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/client/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/client/components/ui/sheet'
import { Link } from '@/client/components/link'
import { Brand } from '@/client/components/brand'

import { LandingPage, Page1, Page2, ProtectedRoutes } from '@/client/routes'
import { useRouter, useAppPending } from '@/client/store/app-store'
import { useAuth, useAuthStore } from '@/client/store/auth-store'
import { useTranslate } from '@/client/i18n/client'
import { cn } from '@/client/lib/utils'
import { MaxWidthWrapper } from './max-width-wrapper'

export const CustomNavbar = () => {
  const pathname = usePathname()
  const router = useRouter()
  const isPending = useAppPending()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const userInfo = useAuthStore(state => state.userInfo)
  const authToken = useAuthStore(state => state.authToken)

  const { logout, getProfile } = useAuth()
  const { t } = useTranslate('auth')

  const menuItems = [
    {
      name: 'Page1',
      link: Page1
    },
    {
      name: 'Page2',
      link: Page2
    }
  ]

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!authToken.refreshToken && ProtectedRoutes.includes(pathname)) router.replace(LandingPage)
  }, [authToken, router, pathname])

  useEffect(() => {
    if (!userInfo && authToken.refreshToken) {
      getProfile()
    }
  }, [getProfile, userInfo, authToken])

  useEffect(() => {
    if (isPending) {
      NProgress.start()
    } else {
      NProgress.done()
    }
  }, [isPending])

  if (pathname.startsWith('/auth')) {
    return null
  }

  return (
    <div
      className={cn(
        'px-4 h-16 border-b sticky top-0 bg-background z-50',
        pathname === LandingPage && 'bg-transparent backdrop-blur-sm border-b-0'
      )}
    >
      <MaxWidthWrapper className="flex justify-between items-start">
        <div className="h-full flex">
          <Sheet open={isMenuOpen} onOpenChange={val => setIsMenuOpen(val)}>
            <SheetTrigger>
              <LuAlignJustify className="text-xl mr-2 sm:hidden" />
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col items-center gap-4 pt-8">
                {menuItems.map(item => (
                  <Link
                    key={item.link}
                    className={cn(
                      'pb-2 border-b-4 border-transparent transition-colors',
                      pathname === item.link && 'border-primary'
                    )}
                    href={item.link}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
          <Brand className="mr-4" />
          <div className="hidden sm:flex gap-4">
            {menuItems.map(item => (
              <Link
                key={item.link}
                className={cn(
                  'border-b-4 border-transparent transition-colors',
                  pathname === item.link && 'border-primary'
                )}
                href={item.link}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        {userInfo ? (
          <div className="h-full flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full overflow-hidden">
                  <img src={userInfo?.avatar?.url} alt="avatar" className="w-full h-full object-cover" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <p className="font-bold">{userInfo.name}</p>
                  <p className="font-bold">{userInfo.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    router.replace('/profile')
                  }}
                >
                  {t('text.personal_information')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    router.replace('/reset-password')
                  }}
                >
                  {t('text.reset_password')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={logout}>
                  {t('text.logout')}
                  <DropdownMenuShortcut>
                    <LuLogOut className="text-lg" />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="h-full flex items-center gap-2">
            <Button size="sm" variant="outline">
              <Link className="cursor-pointer" href="/auth/login">
                {t('text.login')}
              </Link>
            </Button>
            <Button size="sm" variant="outline">
              <Link className="cursor-pointer" href="/auth/register">
                {t('text.register')}
              </Link>
            </Button>
          </div>
        )}
      </MaxWidthWrapper>
    </div>
  )
}
