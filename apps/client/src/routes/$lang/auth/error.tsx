import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { TipError } from '@/components/tip-error'

import { CardWrapper } from './-components/card-wrapper'

export const Route = createFileRoute('/$lang/auth/error')({
  component: RouteComponent,
  validateSearch: search => ({ msg: search.msg as string })
})

function RouteComponent() {
  const { t } = useTranslation('auth')

  const { msg } = Route.useSearch()

  return (
    <CardWrapper
      headerLabel={t('something_went_wrong')}
      backButtonLabel={t('text.back_to_login')}
      backButtonTo="/$lang/auth/login"
    >
      <TipError message={msg} />
    </CardWrapper>
  )
}
