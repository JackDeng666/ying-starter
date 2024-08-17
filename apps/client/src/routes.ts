export const LandingPage = '/'
export const ArticlePage = '/article'
export const ArticleDetailPage = '/article/:id'
export const FeedbackPage = '/feedback'

export const LoginPage = '/auth/login'
export const RegisterPage = '/auth/register'
export const NewVerificationPage = '/auth/new-verification'
export const ForgotPasswordPage = '/auth/forgot-password'
export const NewPasswordPage = '/auth/new-password'
export const AuthErrorPage = '/auth/error'

export const ProfilePage = '/profile'
export const ResetPasswordPage = '/reset-password'

export const UserPages = [
  {
    name: 'text.personal_information',
    link: ProfilePage
  },
  {
    name: 'text.reset_password',
    link: ResetPasswordPage
  }
]

export const ProtectedRoutes = [...UserPages.map(el => el.link)]

export const DefaultLoginRedirect = '/profile'

export const AllRoutes = [
  LandingPage,
  ArticlePage,
  ArticleDetailPage,
  FeedbackPage,
  LoginPage,
  RegisterPage,
  NewVerificationPage,
  ForgotPasswordPage,
  NewPasswordPage,
  AuthErrorPage,
  ...ProtectedRoutes
]
