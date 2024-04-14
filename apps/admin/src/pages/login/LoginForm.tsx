import { App, Button, Form, Input } from 'antd'
import { useCallback, useState } from 'react'
import { AdminLoginDto } from '@ying/shared'

import { getUserInfo, setUserToken } from '@/admin/store'
import { authApi } from '@/admin/api'

import { LoginStateEnum, useLoginStateContext } from './providers/LoginStateProvider'

const useSignIn = () => {
  const { notification } = App.useApp()

  const signIn = useCallback(
    async (data: AdminLoginDto) => {
      const res = await authApi.login(data)
      const { accessToken, refreshToken } = res
      setUserToken({ accessToken, refreshToken })

      const userInfo = await getUserInfo()

      notification.success({
        message: '登录成功',
        description: `欢迎回来: ${userInfo.name}`,
        duration: 2
      })
    },
    [notification]
  )

  return signIn
}

function LoginForm() {
  const [loading, setLoading] = useState(false)

  const { loginState } = useLoginStateContext()
  const signIn = useSignIn()

  if (loginState !== LoginStateEnum.LOGIN) return null

  const handleFinish = async ({ username, password }: AdminLoginDto) => {
    setLoading(true)
    try {
      await signIn({ username, password })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="mb-4 text-2xl font-bold xl:text-3xl">登录</div>
      <Form name="login" size="large" onFinish={handleFinish}>
        <Form.Item name="username" rules={[{ required: true, message: '请输入账号' }]}>
          <Input placeholder="账号" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
          <Input.Password type="password" placeholder="密码" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full" loading={loading}>
            登录
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default LoginForm
