import { cookies } from 'next/headers'
import { AppKey } from '@/client/enum'
import { UserEntity } from '@ying/shared/entities'

export const getProfile = async (): Promise<UserEntity> => {
  const cookie = cookies()
  const token = cookie.get(AppKey.QueryAccessTokenKey)

  const res = await fetch(process.env.API_URL + '/user/profile', {
    headers: {
      authorization: `Bearer ${token?.value}`
    }
  })

  const data = await res.json()

  return data.data
}
