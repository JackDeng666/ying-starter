'use client'

import { FaGoogle, FaGithub, FaFacebook } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { AuthProvider, signIn } from '@/lib/sign-in'

export const Social = () => {
  const onClick = async (provider: AuthProvider) => {
    signIn({
      provider
    })
  }

  return (
    <div className="flex flex-col items-center w-full gap-y-2">
      <Button className="w-full flex gap-2" variant="outline" onClick={() => onClick('google')}>
        <FaGoogle className="h-5 w-5" />
        <span>Google 登录</span>
      </Button>
      <Button className="w-full flex gap-2" variant="outline" onClick={() => onClick('github')}>
        <FaGithub className="h-5 w-5" />
        <span>Github 登录</span>
      </Button>
      <Button className="w-full flex gap-2" variant="outline" onClick={() => onClick('facebook')}>
        <FaFacebook className="h-5 w-5" />
        <span>Facebook 登录</span>
      </Button>
    </div>
  )
}
