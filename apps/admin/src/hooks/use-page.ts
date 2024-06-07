import { useCallback, useEffect, useMemo, useState } from 'react'
import { TablePaginationConfig } from 'antd/es/table'
import { ListDto } from '@ying/shared'
import { useFetch } from '@ying/fontend-shared/hooks'

type UsePageOptions<T> = {
  listApi: (pageOptions: ListDto) => Promise<T>
  listCount: () => Promise<number>
  defaultPageSize?: 10 | 20 | 30 | 40 | 50 | 80 | 100
}

export const usePage = <T>({ listApi, listCount, defaultPageSize = 10 }: UsePageOptions<T>) => {
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState<number>(defaultPageSize)

  const {
    data: list,
    loading: listLoading,
    run: loadList
  } = useFetch<T, { page: number; size: number }>({
    func: useCallback((params?: object) => listApi(params), [listApi]),
    immediately: false
  })

  const {
    data: count,
    loading: countLoading,
    run: loadListCount
  } = useFetch({
    func: useCallback(() => listCount(), [listCount])
  })

  const resetPagination = () => {
    setCurrent(1)
  }

  const onChange = useCallback(
    (page: number, pageSize: number) => {
      setCurrent(page)
      setPageSize(pageSize)
      loadList({ page, size: pageSize })
    },
    [loadList]
  )

  const pagination = useMemo<TablePaginationConfig>(() => {
    return {
      current,
      total: count,
      showSizeChanger: true,
      pageSize,
      pageSizeOptions: [10, 20, 30, 40, 50, 80, 100],
      onChange,
      showTotal: () => `总共 ${count} 条`
    }
  }, [current, count, onChange, pageSize])

  const reload = useCallback(() => {
    resetPagination()
    loadList({ page: current, size: pageSize })
    loadListCount()
  }, [loadList, loadListCount, current, pageSize])

  const reloadCurrent = useCallback(() => {
    loadList({ page: current, size: pageSize })
  }, [loadList, current, pageSize])

  useEffect(() => {
    loadList({ page: current, size: pageSize })
  }, [])

  return {
    list,
    listLoading,
    count,
    countLoading,
    loadList,
    loadListCount,
    pagination,
    resetPagination,
    reload,
    reloadCurrent
  }
}
