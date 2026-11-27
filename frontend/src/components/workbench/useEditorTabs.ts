import { useState } from 'react'

export const WELCOME_TAB_ID = 'welcome'

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

  return {
    openTabIds,
    activeTabId,
    openTab,
    closeTab,
    selectTab: setActiveTabId,
  }
}
