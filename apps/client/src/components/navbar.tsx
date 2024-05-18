'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import {
  Button,
  Image,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Navbar
} from '@nextui-org/react'
import NextImage from 'next/image'
import { LuLogOut } from 'react-icons/lu'
import NProgress from 'nprogress'

import { Brand } from '@/client/components/brand'

import { Page1, Page2, ProtectedRoutes } from '@/client/routes'
import { useRouter, useAppPending } from '@/client/store/app-store'
import { useAuth, useAuthStore } from '@/client/store/auth-store'
import { useTranslate } from '@/client/i18n/client'

export const CustomNavbar = () => {
  const pathname = usePathname()
  const router = useRouter()
  const isPending = useAppPending()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const userInfo = useAuthStore(state => state.userInfo)
  const authToken = useAuthStore(state => state.authToken)

  const { logout, getProfile } = useAuth()
  const { t } = useTranslate('auth')

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!authToken.refreshToken && ProtectedRoutes.includes(pathname)) router.replace('/')
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

  if (pathname.startsWith('/auth')) {
    return null
  }

  return (
    <Navbar isBordered onMenuOpenChange={setIsMenuOpen} isMenuOpen={isMenuOpen}>
      <NavbarMenuToggle />
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.name}-${index}`}>
            <Link
              color="foreground"
              className="w-full cursor-pointer"
              size="lg"
              onClick={() => {
                router.push(item.link)
                setIsMenuOpen(false)
              }}
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>

      <NavbarBrand>
        <Brand />
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {menuItems.map((item, index) => (
          <NavbarItem key={`${item.name}-${index}`}>
            <Link color="foreground" className="w-full cursor-pointer" onClick={() => router.push(item.link)}>
              {item.name}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      {userInfo ? (
        <NavbarContent as="div" justify="end">
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button
                variant="faded"
                isIconOnly
                startContent={
                  <Image
                    src={userInfo?.avatar?.url}
                    removeWrapper
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                }
                radius="full"
              ></Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2" textValue="profile">
                <p className="font-semibold">{userInfo.name}</p>
                <p className="font-semibold">{userInfo.email}</p>
              </DropdownItem>
              <DropdownItem
                key="personal_information"
                textValue={t('text.personal_information')}
                onClick={() => {
                  router.replace('/profile')
                }}
              >
                {t('text.personal_information')}
              </DropdownItem>
              <DropdownItem
                key="reset_password"
                textValue={t('text.reset_password')}
                onClick={() => {
                  router.replace('/reset-password')
                }}
              >
                {t('text.reset_password')}
              </DropdownItem>
              <DropdownItem
                key="logout"
                color="danger"
                endContent={<LuLogOut className="text-lg" />}
                textValue={t('text.logout')}
                onClick={logout}
              >
                {t('text.logout')}
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      ) : (
        <NavbarContent justify="end">
          <NavbarItem>
            <Link isBlock color="primary" className="cursor-pointer" onClick={() => router.push('/auth/login')}>
              {t('text.login')}
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link isBlock color="primary" className="cursor-pointer" onClick={() => router.push('/auth/register')}>
              {t('text.register')}
            </Link>
          </NavbarItem>
        </NavbarContent>
      )}
    </Navbar>
  )
}
