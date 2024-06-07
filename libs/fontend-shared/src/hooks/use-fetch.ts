import { useCallback, useEffect, useState } from 'react'

type useFetchOptions<T, U> = {
  func: (params?: U) => Promise<T>
  immediately?: boolean
}

export const useFetch = <T, U>({ func, immediately = true }: useFetchOptions<T, U>) => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<T>()

  const run = useCallback(
    async (params?: U) => {
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
    if (immediately) run()
  }, [run, immediately, func])

  return {
    loading,
    data,
    setData,
    run
  }
}
