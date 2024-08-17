import { useCallback, useEffect, useMemo, useState } from 'react'

import { debounce } from '@ying/utils'

type useFetchOptions<T, U> = {
  func: (params?: U) => Promise<T>
  immediately?: boolean
  debounceTimeout?: number
}

export const useFetch = <T, U>({ func, immediately = true, debounceTimeout = 500 }: useFetchOptions<T, U>) => {
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

  const debounceRun = useMemo(() => {
    return debounce(async (params?: U) => {
      try {
        setLoading(true)
        const res = await func(params)
        setData(res)
      } catch (error) {
      } finally {
        setLoading(false)
      }
    }, debounceTimeout)
  }, [debounceTimeout, func])

  useEffect(() => {
    if (immediately) run()
  }, [run, immediately, func])

  return {
    loading,
    data,
    setData,
    run,
    debounceRun
  }
}
