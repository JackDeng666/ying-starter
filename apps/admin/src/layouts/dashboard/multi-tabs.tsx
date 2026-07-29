import { Dropdown, MenuProps, Tabs, TabsProps } from 'antd'
import Color from 'color'
import { CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { DragDropContext, Draggable, Droppable, OnDragEndResponder } from '@hello-pangea/dnd'
// import { useToggle, useFullscreen } from 'react-use'

import { Iconify } from '@/components/icon'
import useKeepAlive, { KeepAliveTab } from '@/hooks/use-keepalive'
import { useRouter } from '@/router/hooks'
import { useThemeToken } from '@/theme/hooks'
import { MultiTabOperation } from '@/types/enum'

import { MULTI_TABS_HEIGHT } from './constant'
import { Main } from './main'

export function MultiTabs() {
  const { push } = useRouter()
  const scrollContainer = useRef<HTMLDivElement>(null)
  const [hoveringTabKey, setHoveringTabKey] = useState('')
  const [openDropdownTabKey, setopenDropdownTabKey] = useState('')
  const themeToken = useThemeToken()

  // const tabContentRef = useRef<HTMLDivElement>(null)
  // const [fullScreen, toggleFullScreen] = useToggle(false)
  // useFullscreen(tabContentRef, fullScreen, {
  //   onClose: () => toggleFullScreen(false)
  // })

  const { tabs, activeTabRoutePath, setTabs, closeTab, refreshTab, closeOthersTab, closeAll, closeLeft, closeRight } =
    useKeepAlive()

  /**
   * tab dropdown下拉选
   */
  const menuItems = useMemo<MenuProps['items']>(
    () => [
      // {
      //   label: '内容全屏',
      //   key: MultiTabOperation.FULLSCREEN,
      //   icon: <Iconify icon="material-symbols:fullscreen" size={18} />
      // },
      {
        label: '刷新',
        key: MultiTabOperation.REFRESH,
        icon: <Iconify icon="mdi:reload" size={18} />
      },
      {
        label: '关闭标签页',
        key: MultiTabOperation.CLOSE,
        icon: <Iconify icon="material-symbols:close" size={18} />,
        disabled: tabs.length === 1
      },
      {
        type: 'divider'
      },
      {
        label: '关闭左侧标签页',
        key: MultiTabOperation.CLOSELEFT,
        icon: <Iconify icon="material-symbols:tab-close-right-outline" size={18} className="rotate-180" />,
        disabled: tabs.findIndex(tab => tab.key === openDropdownTabKey) === 0
      },
      {
        label: '关闭右侧标签页',
        key: MultiTabOperation.CLOSERIGHT,
        icon: <Iconify icon="material-symbols:tab-close-right-outline" size={18} />,
        disabled: tabs.findIndex(tab => tab.key === openDropdownTabKey) === tabs.length - 1
      },
      {
        type: 'divider'
      },
      {
        label: '关闭其它标签页',
        key: MultiTabOperation.CLOSEOTHERS,
        icon: <Iconify icon="material-symbols:tab-close-outline" size={18} />,
        disabled: tabs.length === 1
      },
      {
        label: '关闭所有标签页',
        key: MultiTabOperation.CLOSEALL,
        icon: <Iconify icon="mdi:collapse-all-outline" size={18} />
      }
    ],
    [openDropdownTabKey, tabs]
  )

  /**
   * tab dropdown click
   */
  const menuClick = useCallback(
    (menuInfo: Parameters<MenuProps['onClick']>[0], tab: KeepAliveTab) => {
      const { key, domEvent } = menuInfo
      domEvent.stopPropagation()
      switch (key) {
        case MultiTabOperation.REFRESH:
          refreshTab(tab.key)
          break
        case MultiTabOperation.CLOSE:
          closeTab(tab.key)
          break
        case MultiTabOperation.CLOSEOTHERS:
          closeOthersTab(tab.key)
          break
        case MultiTabOperation.CLOSELEFT:
          closeLeft(tab.key)
          break
        case MultiTabOperation.CLOSERIGHT:
          closeRight(tab.key)
          break
        case MultiTabOperation.CLOSEALL:
          closeAll()
          break
        // case MultiTabOperation.FULLSCREEN:
        //   toggleFullScreen()
        //   break
        default:
          break
      }
    },
    [refreshTab, closeTab, closeOthersTab, closeLeft, closeRight, closeAll]
  )

  /**
   * 当前显示dorpdown的tab
   */
  const onOpenChange = (open: boolean, tab: KeepAliveTab) => {
    if (open) {
      setopenDropdownTabKey(tab.key)
    } else {
      setopenDropdownTabKey('')
    }
  }

  /**
   * tab样式
   */
  const calcTabStyle: (tab: KeepAliveTab) => CSSProperties = useCallback(
    tab => {
      const isActive = tab.key === activeTabRoutePath || tab.key === hoveringTabKey
      const result: CSSProperties = {
        borderRadius: '8px 8px 0 0',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: themeToken.colorBorderSecondary,
        backgroundColor: themeToken.colorBgContainer,
        transition: 'color 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, background 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'
      }

      if (isActive) {
        result.backgroundColor = themeToken.colorBgLayout
        result.color = themeToken.colorPrimaryText
      }
      return result
    },
    [activeTabRoutePath, hoveringTabKey, themeToken]
  )

  /**
   * 渲染单个tab
   */
  const renderTabLabel = useCallback(
    (tab: KeepAliveTab) => {
      return (
        <Dropdown
          trigger={['contextMenu']}
          menu={{
            items: menuItems,
            onClick: menuInfo => menuClick(menuInfo, tab)
          }}
          onOpenChange={open => onOpenChange(open, tab)}
        >
          <div
            className="relative mx-px flex select-none items-center px-4 py-1"
            style={calcTabStyle(tab)}
            onMouseEnter={() => {
              if (tab.key === activeTabRoutePath) return
              setHoveringTabKey(tab.key)
            }}
            onMouseLeave={() => setHoveringTabKey('')}
          >
            <div>{tab.label}</div>
            <Iconify
              icon="ion:close-outline"
              size={18}
              className="cursor-pointer opacity-50"
              onClick={e => {
                e.stopPropagation()
                closeTab(tab.key)
              }}
              style={{
                visibility:
                  (tab.key !== activeTabRoutePath && tab.key !== hoveringTabKey) || tabs.length === 1
                    ? 'hidden'
                    : 'visible'
              }}
            />
          </div>
        </Dropdown>
      )
    },
    [menuItems, activeTabRoutePath, hoveringTabKey, tabs.length, menuClick, closeTab, calcTabStyle]
  )

  /**
   * 所有tab
   */
  const tabItems = useMemo(() => {
    return tabs?.map(tab => ({
      label: renderTabLabel(tab),
      key: tab.key,
      closable: tabs.length > 1, // 保留一个
      children: <Main key={tab.timeStamp}>{tab.children}</Main>
    }))
  }, [tabs, renderTabLabel])

  /**
   * 拖拽结束事件
   */
  const onDragEnd: OnDragEndResponder = ({ destination, source }) => {
    // 拖拽到非法非 droppable区域
    if (!destination) {
      return
    }
    // 原地放下
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }

    const newTabs = Array.from(tabs)
    const [movedTab] = newTabs.splice(source.index, 1)
    newTabs.splice(destination.index, 0, movedTab)
    setTabs(newTabs)
  }

  /**
   * 渲染 tabbar
   */
  const { colorBorder, colorBgElevated } = useThemeToken()

  const multiTabsStyle: CSSProperties = {
    height: MULTI_TABS_HEIGHT,
    paddingTop: 4,
    backgroundColor: Color(colorBgElevated).alpha(1).toString(),
    borderBottom: `1px dashed ${Color(colorBorder).alpha(0.6).toString()}`
  }

  const renderTabBar: TabsProps['renderTabBar'] = () => {
    return (
      <div style={multiTabsStyle} className="z-20 sticky top-0 w-full">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="tabsDroppable" direction="horizontal">
            {provided => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="flex w-full">
                <div ref={scrollContainer} className="overflow-scroll shrink-0 no-scrollbar! flex w-full px-2">
                  {tabs.map((tab, index) => (
                    <div id={`tab-${index}`} className="shrink-0" key={tab.key} onClick={() => push(tab.key)}>
                      <Draggable key={tab.key} draggableId={tab.key} index={index}>
                        {provided => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="w-auto"
                          >
                            {renderTabLabel(tab)}
                          </div>
                        )}
                      </Draggable>
                    </div>
                  ))}
                </div>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    )
  }

  /**
   * 路由变化时，滚动到指定tab
   */
  useEffect(() => {
    if (!scrollContainer || !scrollContainer.current) {
      return
    }
    const index = tabs.findIndex(tab => tab.key === activeTabRoutePath)
    const currentTabElement = scrollContainer.current.querySelector(`#tab-${index}`)
    if (currentTabElement) {
      currentTabElement.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      })
    }
  }, [activeTabRoutePath, tabs])

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

  return (
    <Tabs
      size="small"
      type="card"
      tabBarGutter={4}
      activeKey={activeTabRoutePath}
      items={tabItems}
      renderTabBar={renderTabBar}
    />
  )
}
