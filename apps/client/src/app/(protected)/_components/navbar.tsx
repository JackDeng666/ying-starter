'use client'

// import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { UserButton } from './user-button'
import { cn } from '@/lib/utils'

export const Navbar = () => {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <nav className="flex justify-between items-end p-4 pb-0 shadow-sm">
      <div className="flex gap-x-4">
        <div
          className={cn('w-20 text-center h-10 border-blue-500', pathname === '/profile' ? 'border-b-4' : 'border-b-0')}
        >
          <div
            className="cursor-pointer"
            onClick={() => {
              router.replace('/profile')
            }}
          >
            个人信息
          </div>
          {/* <Link href="/profile">个人信息</Link> */}
        </div>
        <div
          className={cn(
            'w-20 text-center h-10 border-blue-500',
            pathname === '/reset-password' ? 'border-b-4' : 'border-b-0'
          )}
        >
          <div
            className="cursor-pointer"
            onClick={() => {
              router.replace('/reset-password')
            }}
          >
            重置密码
          </div>
          {/* <Link href="/reset-password">重置密码</Link> */}
        </div>
      </div>
      <UserButton />
    </nav>
  )
}
