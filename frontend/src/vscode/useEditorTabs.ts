import { useState } from 'react'
import { isInside } from './useExplorerTree'

// 탭 id는 파일 경로다. 파일 이름에는 '/'를 쓸 수 없으므로 이 값은 어떤 경로와도 겹치지 않는다
export const WELCOME_TAB_ID = 'welcome://'

// 에디터에 열린 탭 목록과 지금 보고 있는 탭
export function useEditorTabs() {
  const [openTabIds, setOpenTabIds] = useState<string[]>([WELCOME_TAB_ID])
  const [activeTabId, setActiveTabId] = useState<string | undefined>(
    WELCOME_TAB_ID,
  )

  const openTab = (tabId: string) => {
    if (!openTabIds.includes(tabId)) {
      setOpenTabIds([...openTabIds, tabId])
    }
    setActiveTabId(tabId)
  }

  // 보고 있던 탭을 닫으면 오른쪽 탭, 없으면 왼쪽 탭을 보여준다
  const closeTab = (tabId: string) => {
    const closedIndex = openTabIds.indexOf(tabId)
    const remainingTabIds = openTabIds.filter(
      (openTabId) => openTabId !== tabId,
    )
    setOpenTabIds(remainingTabIds)

    if (tabId !== activeTabId) {
      return
    }
    const nextIndex = Math.min(closedIndex, remainingTabIds.length - 1)
    setActiveTabId(remainingTabIds[nextIndex])
  }

  // 탐색기에서 지운 파일(폴더라면 안의 파일까지)의 탭을 닫는다
  const closeTabsOf = (path: string) => {
    const isDeleted = (tabId: string) => tabId === path || isInside(tabId, path)
    const remainingTabIds = openTabIds.filter((tabId) => !isDeleted(tabId))
    setOpenTabIds(remainingTabIds)

    if (activeTabId !== undefined && isDeleted(activeTabId)) {
      setActiveTabId(remainingTabIds.at(-1))
    }
  }

  // 탐색기에서 이름을 바꾸면 열린 탭의 경로도 바꾼다
  const renameTabsOf = (path: string, newPath: string) => {
    const toNewTabId = (tabId: string) => {
      if (tabId === path) {
        return newPath
      }
      return isInside(tabId, path) ? newPath + tabId.slice(path.length) : tabId
    }
    setOpenTabIds(openTabIds.map(toNewTabId))
    if (activeTabId !== undefined) {
      setActiveTabId(toNewTabId(activeTabId))
    }
  }

  return {
    openTabIds,
    activeTabId,
    openTab,
    closeTab,
    closeTabsOf,
    renameTabsOf,
    selectTab: setActiveTabId,
  }
}
