export type AuthProvider = 'google' | 'github' | 'facebook'

type SignInProps = {
  provider: AuthProvider
}

export const signIn = ({ provider }: SignInProps) => {
  let url = ''
  switch (provider) {
    case 'github':
      url = process.env.NEXT_PUBLIC_API_URL + '/auth/github'
      break
    case 'google':
      url = process.env.NEXT_PUBLIC_API_URL + '/auth/google'
      break
    case 'facebook':
      url = process.env.NEXT_PUBLIC_API_URL + '/auth/facebook'
      break
  }
  window.location.href = url
}
