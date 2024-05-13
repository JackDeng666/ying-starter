import { useCallback, useEffect, useState } from 'react'

type UseFetchOptions<T> = {
  func: (params?: any) => Promise<T>
  immediately?: boolean
}

export const useFetch = <T>({ func, immediately = true }: UseFetchOptions<T>) => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<T>()

  const run = useCallback(
    async (params?: any) => {
      try {
        setLoading(true)
        const res = await func(params)
        setData(res)
      } catch (error) {
      } finally {
        setLoading(false)
      }
    },
    [func]
  )

  useEffect(() => {
    if (immediately) run({})
  }, [run, immediately, func])

  return {
    loading,
    data,
    setData,
    run
  }
}
