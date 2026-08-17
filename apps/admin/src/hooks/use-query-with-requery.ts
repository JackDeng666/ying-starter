import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { debounce } from '@ying/utils'

type useQueryWithRequeryOptions<TFn extends (...args: any) => Promise<any>> = {
  key: string
  queryFn: TFn
}

export const useQueryWithRequery = <TFn extends (...args: any) => Promise<any>>({
  key,
  queryFn
}: useQueryWithRequeryOptions<TFn>) => {
  const [params, setParams] = useState<Parameters<TFn> | []>([])
  const requery = debounce((...params: Parameters<TFn>) => {
    setParams(params)
  }, 500)
  const { data, isFetching: loading } = useQuery<Awaited<ReturnType<TFn>>>({
    queryKey: [key, params],
    queryFn: () => queryFn(...params)
  })

  return {
    data,
    loading,
    requery
  }
}
