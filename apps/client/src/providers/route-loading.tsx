import { useEffect, useState } from 'react'
import { useRouterState } from '@tanstack/react-router'
import { LoadingBar } from '@/components/loading-bar'

export function RouteLoading() {
  const [loading, setLoading] = useState(true)
  const { status } = useRouterState()

  // 初次渲染服务端的status总是等于pending,客户端加载好总是等于idle导致水合错误
  useEffect(() => {
    setLoading(status === 'pending')
  }, [status])

  return <LoadingBar classNames={{ wrapper: 'fixed z-999', bar: 'via-primary/70' }} loading={loading} />
}
