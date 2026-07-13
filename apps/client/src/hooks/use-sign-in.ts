type AuthProvider = 'google' | 'github'

export const useSignIn = () => {
  const signIn = (provider: AuthProvider) => {
    let url = ''
    switch (provider) {
      case 'google':
        url = '/api/client/auth/google'
        break
      case 'github':
        url = '/api/client/auth/github'
        break
    }
    window.location.replace(url)
  }
  return signIn
}
