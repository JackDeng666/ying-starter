'use client'

import { logout } from '@/store/auth-store'

interface LogoutButtonProps {
  children?: React.ReactNode
}

export const LogoutButton = ({ children }: LogoutButtonProps) => {
  return <span onClick={logout}>{children}</span>
}
