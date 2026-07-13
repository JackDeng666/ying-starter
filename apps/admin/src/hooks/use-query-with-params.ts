import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { debounce } from '@ying/utils'

type UseQueryWithParamsOptions<TParams, TData> = {
  key: string
  queryFn: (params: TParams) => Promise<TData>
  initialParams?: TParams
}

export const useQueryWithParams = <TParams, TData>({
  key,
  queryFn,
  initialParams
}: UseQueryWithParamsOptions<TParams, TData>) => {
  const [params, setParams] = useState<TParams | undefined>(initialParams)

  const debounceSetParams = debounce((params: TParams) => {
    setParams(params)
  }, 500)

  const { data, isFetching: loading } = useQuery({
    queryKey: [key, params],
    queryFn: () => queryFn(params ?? ({} as TParams))
  })

  return {
    data,
    loading,
    debounceSetParams
  }
}
