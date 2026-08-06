import { useEffect, useRef } from 'react'
import { DndContext, type DragEndEvent, useSensor, PointerSensor, closestCenter } from '@dnd-kit/core'
import { SortableContext, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { restrictToHorizontalAxis, restrictToParentElement } from '@dnd-kit/modifiers'
import { cn } from '@ying/frontend/ui'
import { useThemeToken } from '@/hooks'
import { PropsWithClassName } from '@/types'
import { MULTI_TABS_HEIGHT } from '../constant'
import { Main } from '../main'
import { useKeepaliveContext } from './use-keepalive-context'
import { SortableTab } from './sortable-tab'

export function SortableTabs({ className }: PropsWithClassName) {
  const scrollContainer = useRef<HTMLDivElement>(null)
  const themeToken = useThemeToken()

  const { tabs, activeTabKey, setTabs } = useKeepaliveContext()

  /**
   * 拖拽结束事件
   */
  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      const oldIndex = tabs.findIndex(el => el.key === active.id)
      const newIndex = tabs.findIndex(el => el.key === over.id)
      const newTabs = arrayMove(tabs, oldIndex, newIndex)
      setTabs(newTabs)
    }
  }

  /**
   * 路由变化时，滚动到指定tab
   */
  useEffect(() => {
    if (!scrollContainer || !scrollContainer.current) {
      return
    }
    const index = tabs.findIndex(tab => tab.key === activeTabKey)
    const currentTabElement = scrollContainer.current.querySelector(`#tab-${index}`)
    if (currentTabElement) {
      currentTabElement.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      })
    }
  }, [activeTabKey, tabs])

  /**
   * scrollContainer 监听wheel事件
   */
  useEffect(() => {
    function handleMouseWheel(event: WheelEvent) {
      event.preventDefault()
      scrollContainer.current.scrollLeft += event.deltaY
    }

    scrollContainer.current.addEventListener(
      'mouseenter',
      () => {
        scrollContainer.current.addEventListener('wheel', handleMouseWheel, { passive: false })
      },
      { passive: false }
    )
    scrollContainer.current.addEventListener(
      'mouseleave',
      () => {
        scrollContainer.current.removeEventListener('wheel', handleMouseWheel)
      },
      { passive: false }
    )
  }, [])

  const sensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  const modifiers = [
    restrictToHorizontalAxis, // 限制只能在水平轴移动
    restrictToParentElement // 限制拖拽范围不超出父级 scrollContainer
  ]

  return (
    <div className={cn('flex flex-col', className)}>
      <div
        ref={scrollContainer}
        style={{
          height: MULTI_TABS_HEIGHT,
          paddingTop: 4,
          background: themeToken.colorBgLayout
        }}
        className="z-20 w-full border-b border-border/60 overflow-x-auto overflow-y-hidden no-scrollbar flex flex-nowrap gap-x-1.5 px-3"
      >
        <DndContext onDragEnd={onDragEnd} sensors={[sensor]} collisionDetection={closestCenter} modifiers={modifiers}>
          <SortableContext items={tabs.map(i => i.key)} strategy={horizontalListSortingStrategy}>
            {tabs.map((tab, index) => (
              <SortableTab key={tab.key} tab={tab} index={index} />
            ))}
          </SortableContext>
        </DndContext>
      </div>
      {tabs.map(tab => (
        <Main key={tab.timeStamp} className={tab.key === activeTabKey ? 'block' : 'hidden'}>
          {tab.children}
        </Main>
      ))}
    </div>
  )
}
