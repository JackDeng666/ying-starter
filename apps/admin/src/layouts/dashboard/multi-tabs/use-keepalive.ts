import { useEffect, useRef, useState } from 'react'
import { useCurrentRouteMeta, useRouter } from '@/router/hooks'
import { RouteMeta } from '@/types/router'

function getKey() {
  return new Date().getTime().toString()
}

export type KeepAliveTab = RouteMeta & {
  children: any
}
export function useKeepAlive() {
  const { push } = useRouter()
  const [tabs, setTabs] = useState<KeepAliveTab[]>([])
  const tabsRef = useRef(tabs)
  tabsRef.current = tabs
  const currentRouteMeta = useCurrentRouteMeta()
  const activeTabKey = currentRouteMeta?.key

  /**
   * Close specified tab
   */
  const closeTab = (path = activeTabKey) => {
    setTabs(prevTabs => {
      if (prevTabs.length === 1) return prevTabs
      const deleteTabIndex = prevTabs.findIndex(item => item.key === path)
      if (path === activeTabKey) {
        if (deleteTabIndex > 0) {
          push(prevTabs[deleteTabIndex - 1].key)
        } else {
          push(prevTabs[deleteTabIndex + 1].key)
        }
      }
      return prevTabs.toSpliced(deleteTabIndex, 1)
    })
  }

  /**
   * Close other tabs besides the specified tab
   */
  const closeOthersTab = (path = activeTabKey) => {
    setTabs(prevTabs => prevTabs.filter(item => item.key === path))
  }

  /**
   * Close all tabs then navigate to the home page
   */
  const closeAll = () => {
    setTabs([])
    push(import.meta.env.APP_HOMEPAGE)
  }

  /**
   * Close all tabs in the left of specified tab
   */
  const closeLeft = (path: string) => {
    push(path)
    setTabs(prevTabs => {
      const currentTabIndex = prevTabs.findIndex(item => item.key === path)
      return prevTabs.slice(currentTabIndex)
    })
  }

  /**
   * Close all tabs in the right of specified tab
   */
  const closeRight = (path: string) => {
    push(path)
    setTabs(prevTabs => {
      const currentTabIndex = prevTabs.findIndex(item => item.key === path)
      return prevTabs.slice(0, currentTabIndex + 1)
    })
  }

  /**
   * Refresh specified tab
   */
  const refreshTab = (path = activeTabKey) => {
    setTabs(prevTabs => {
      const currentTabIndex = prevTabs.findIndex(item => item.key === path)
      if (currentTabIndex >= 0) {
        prevTabs[currentTabIndex].timeStamp = getKey()
      }
      return [...prevTabs]
    })
  }

  useEffect(() => {
    if (!currentRouteMeta) return
    const existed = tabsRef.current.find(item => item.key === currentRouteMeta.key)
    if (!existed) {
      setTabs(prev => [
        ...prev,
        {
          ...currentRouteMeta,
          children: currentRouteMeta.outlet,
          timeStamp: getKey()
        }
      ])
    }
    if (existed?.noCache) {
      setTabs(prev => {
        const index = prev.findIndex(item => item.key === currentRouteMeta.key)
        if (index >= 0) {
          prev[index].timeStamp = getKey()
        }
        return [...prev]
      })
    }
  }, [currentRouteMeta])

  return {
    tabs,
    activeTabKey,
    setTabs,
    closeTab,
    closeOthersTab,
    refreshTab,
    closeAll,
    closeLeft,
    closeRight
  }
}
