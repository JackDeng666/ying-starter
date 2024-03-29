'use client'

import { FaUser } from 'react-icons/fa'
import { ExitIcon } from '@radix-ui/react-icons'
import Image from 'next/image'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuthStore } from '@/store/auth-store'
import { LogoutButton } from './logout-button'
import { useTranslate } from '@/i18n/client'

export const UserButton = () => {
  const { t } = useTranslate()
  const userInfo = useAuthStore(state => state.userInfo)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="mb-4">
        <Avatar className="shadow-md">
          {userInfo?.avatar?.url && (
            <Image
              className="w-full h-full object-cover"
              width={40}
              height={40}
              src={userInfo.avatar.url}
              alt="avatar"
            />
          )}
          <AvatarFallback className="bg-sky-500">
            <FaUser className="text-white" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="end">
        <LogoutButton>
          <DropdownMenuItem className="cursor-pointer">
            <ExitIcon className="h-4 w-4 mr-2" />
            {t('Logout')}
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
