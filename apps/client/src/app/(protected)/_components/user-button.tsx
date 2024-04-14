'use client'

import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Image } from '@nextui-org/react'

import { useAuthStore, useAuth } from '@/client/store/auth-store'
import { useTranslate } from '@/client/i18n/client'
import { LogoutIcon } from '@/client/components/icons'

export const UserButton = () => {
  const { t } = useTranslate()
  const userInfo = useAuthStore(state => state.userInfo)
  const { logout } = useAuth()

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="faded"
          isIconOnly
          startContent={<Image src={userInfo?.avatar?.url} alt="avatar" />}
          className="mb-2"
          radius="full"
        ></Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem startContent={<LogoutIcon className="text-lg" />} textValue={t('Logout')} onClick={logout}>
          {t('Logout')}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
