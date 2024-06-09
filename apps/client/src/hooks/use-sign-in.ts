import { useAppContext } from '@/client/providers/app'

export type AuthProvider = 'google' | 'github' | 'facebook'

type SignInProps = {
  provider: AuthProvider
}

export const useSignIn = () => {
  const { apiUrl } = useAppContext()

  const signIn = ({ provider }: SignInProps) => {
    let url = ''
    switch (provider) {
      case 'github':
        url = apiUrl + '/auth/github'
        break
      case 'google':
        url = apiUrl + '/auth/google'
        break
      case 'facebook':
        url = apiUrl + '/auth/facebook'
        break
    }
    window.location.href = url
  }
  return signIn
}
