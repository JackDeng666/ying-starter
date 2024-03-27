import { cookies } from 'next/headers'
import { AppKey } from '@/enum'
import { UserEntity } from '@shared/entities'

export const getProfile = async (): Promise<UserEntity> => {
  const cookie = cookies()
  const token = cookie.get(AppKey.CookieTokenKey)

  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/user/profile', {
    headers: {
      authorization: `Bearer ${token?.value}`
    }
  })

  const data = await res.json()

  return data.data
}
