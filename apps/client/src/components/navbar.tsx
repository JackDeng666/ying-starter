'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  Image,
  Button,
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
import { LuLogOut } from 'react-icons/lu'

import { Brand } from '@/client/components/brand'

import { Page1, Page2, ProtectedRoutes } from '@/client/routes'
import { useAuth, useAuthStore } from '@/client/store/auth-store'
import { useTranslate } from '@/client/i18n/client'

export const CustomNavbar = () => {
  const pathname = usePathname()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const userInfo = useAuthStore(state => state.userInfo)
  const authToken = useAuthStore(state => state.authToken)

  const { logout, getProfile } = useAuth()
  const { t } = useTranslate()

  const router = useRouter()

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
      <NavbarMenuToggle className="sm:hidden" />
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
                startContent={<Image src={userInfo?.avatar?.url} alt="avatar" />}
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
                textValue={t('Personal information')}
                onClick={() => {
                  router.replace('/profile')
                }}
              >
                {t('Personal information')}
              </DropdownItem>
              <DropdownItem
                key="reset_password"
                textValue={t('Reset password')}
                onClick={() => {
                  router.replace('/reset-password')
                }}
              >
                {t('Reset password')}
              </DropdownItem>
              <DropdownItem
                key="logout"
                color="danger"
                endContent={<LuLogOut className="text-lg" />}
                textValue={t('Logout')}
                onClick={logout}
              >
                {t('Logout')}
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      ) : (
        <NavbarContent justify="end">
          <NavbarItem>
            <Link isBlock color="primary" className="cursor-pointer" onClick={() => router.push('/auth/login')}>
              Login
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link isBlock color="primary" className="cursor-pointer" onClick={() => router.push('/auth/register')}>
              Sign Up
            </Link>
          </NavbarItem>
        </NavbarContent>
      )}
    </Navbar>
  )
}
