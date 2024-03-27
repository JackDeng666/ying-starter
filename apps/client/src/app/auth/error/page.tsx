'use client'

import { useSearchParams } from 'next/navigation'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { CardWrapper } from '../_components/card-wrapper'

const AuthErrorPage = () => {
  const searcheParams = useSearchParams()
  const msg = searcheParams.get('msg')

  return (
    <CardWrapper headerLabel="出错了！" backButtonHref="/auth/login" backButtonLabel="回到登录">
      <div className="w-full flex justify-center items-center gap-2 text-destructive">
        <ExclamationTriangleIcon className="text-destructive" />
        {msg}
      </div>
    </CardWrapper>
  )
}

export default AuthErrorPage
