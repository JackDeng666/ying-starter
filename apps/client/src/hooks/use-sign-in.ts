import { useAppContext } from '@/client/providers/app'
import { useRouter } from '@/client/store/app-store'

export type AuthProvider = 'google' | 'github' | 'facebook'

type SignInProps = {
  provider: AuthProvider
}

export const useSignIn = () => {
  const router = useRouter()
  const { serverUrl } = useAppContext()

  const signIn = ({ provider }: SignInProps) => {
    let url = ''
    switch (provider) {
      case 'github':
        url = serverUrl + '/api/client/auth/github'
        break
      case 'google':
        url = serverUrl + '/api/client/auth/google'
        break
      case 'facebook':
        url = serverUrl + '/api/client/auth/facebook'
        break
    }

    router.replace(url)
  }
  return signIn
}
