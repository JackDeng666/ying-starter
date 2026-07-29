import { useEffect, useRef, useState } from 'react'
import { TableProps, Table, PaginationProps, Pagination } from 'antd'
import { cn } from '@ying/frontend/ui'
import { useThemeToken } from '@/theme/hooks'
import { ScrollbarThickness } from '@/constant'
import { useViewportRemainingHeight } from './use-viewport-remaining-height'
import { getTableX } from './get-table-x'

type PageProps<T> = {
  recommendedPageHeight?: number // 当前 page 的推荐高度，默认值为路由页面的显示高度
  classNames?: {
    wrapper?: string
    header?: string
    body?: string
    footer?: string
  }
  header?: React.ReactNode
  // 根据 recommendedPageHeight, header 和 footer 的动态高度计算的组件内容推荐高度
  body?: React.ReactNode | ((recommendedBodyHeight: number) => React.ReactNode)
  footer?: React.ReactNode
  table?: TableProps<T>
  pagination?: PaginationProps
}

export const Page = <T,>({
  recommendedPageHeight,
  classNames,
  header,
  body,
  footer,
  table,
  pagination
}: PageProps<T>) => {
  const { colorBgContainer } = useThemeToken()
  const remainingHeight = useViewportRemainingHeight()
  const pageHeight = recommendedPageHeight ?? window.innerHeight - remainingHeight
  const [recommendedBodyHeight, setRecommendedBodyHeight] = useState(0)

  const headerRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)
  const heightRef = useRef(0)

  const x = getTableX(table?.columns, table?.rowSelection?.columnWidth)
  const y = recommendedBodyHeight - 46 - ScrollbarThickness // 减去表头和可能出现的表格的横向滚动条的高度

  useEffect(() => {
    const rb = new ResizeObserver(entries => {
      let height = 0
      for (const entry of entries) {
        height += entry.target.clientHeight
      }
      if (heightRef.current !== height) {
        heightRef.current = height
        // 减去 header footer 高度, body上下内边距
        setRecommendedBodyHeight(pageHeight - height - 12 * 2)
      }
    })
    if (headerRef.current) rb.observe(headerRef.current)
    if (footerRef.current) rb.observe(footerRef.current)
    return () => rb.disconnect()
  }, [pageHeight])

  return (
    <div className={cn('rounded-md shadow-xs', classNames?.wrapper)} style={{ backgroundColor: colorBgContainer }}>
      {header && (
        <div ref={headerRef} className={cn('border-b border-border p-3', classNames?.header)}>
          {header}
        </div>
      )}
      <div className={cn('p-3', classNames?.body)}>
        {table && (
          <Table
            size="middle"
            scroll={{
              x,
              y
            }}
            pagination={false}
            {...table}
          />
        )}
        {typeof body === 'function' ? body(recommendedBodyHeight) : body}
      </div>
      {(footer || pagination) && (
        <div ref={footerRef} className={cn('border-t border-border p-3 flex justify-end', classNames?.footer)}>
          {footer}
          {pagination && <Pagination size="small" {...pagination} />}
        </div>
      )}
    </div>
  )
}
