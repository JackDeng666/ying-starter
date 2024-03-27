'use client'

import { logout } from '@/store/auth-store'

interface LogoutButtonProps {
  children?: React.ReactNode
}

export const LogoutButton = ({ children }: LogoutButtonProps) => {
  const onClick = async () => {
    await logout()
  }
  return <span onClick={onClick}>{children}</span>
}
