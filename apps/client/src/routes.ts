export const LandingPage = '/'
export const AboutPage = '/about'
export const FeedbackPage = '/feedback'

export const LoginPage = '/auth/login'
export const RegisterPage = '/auth/register'
export const NewVerificationPage = '/auth/new-verification'
export const ForgotPasswordPage = '/auth/forgot-password'
export const NewPasswordPage = '/auth/new-password'
export const AuthErrorPage = '/auth/error'

export const ProfilePage = '/profile'
export const ResetPasswordPage = '/reset-password'

export const ProtectedRoutes = [ProfilePage, ResetPasswordPage]

export const MenuItems = [
  {
    name: 'about',
    link: AboutPage
  },
  {
    name: 'feedback',
    link: FeedbackPage
  }
]

export const DefaultLoginRedirect = '/profile'
