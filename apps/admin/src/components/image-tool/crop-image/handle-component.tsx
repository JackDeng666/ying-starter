import { useThemeToken } from '@/admin/theme/hooks'

import { StyledHandleCom } from './styles'

export const HandleComponent = () => {
  const themeToken = useThemeToken()
  return <StyledHandleCom $token={themeToken} />
}
