import { useCallback, useMemo, useState } from 'react'
import { TablePaginationConfig } from 'antd/es/table'
import { ListDto } from '@ying/shared'
import { useApi } from '@/admin/hooks/use-api'

type UsePageOptions<T> = {
  listApi: (pageOptions: ListDto) => Promise<T>
  listCount: () => Promise<number>
}

export const usePage = <T>({ listApi, listCount }: UsePageOptions<T>) => {
  const {
    data: list,
    loading: listLoading,
    run: loadList
  } = useApi({
    func: useCallback((params: any) => listApi(params), [listApi])
  })

  const {
    data: count,
    loading: countLoading,
    run: loadListCount
  } = useApi({
    func: useCallback(() => listCount(), [listCount])
  })

  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)

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
      pageSizeOptions: [10, 20, 50],
      onChange,
      showTotal: () => `总共 ${count} 条`
    }
  }, [current, count, onChange])

  const reload = useCallback(() => {
    resetPagination()
    loadList({})
    loadListCount()
  }, [loadList, loadListCount])

  const reloadCurretnPage = useCallback(() => {
    loadList({ page: current, size: pageSize })
  }, [current, pageSize, loadList])

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
    reloadCurretnPage
  }
}
