import { useEffect, useState } from 'react'

export type SideBarView =
  | 'explorer'
  | 'search'
  | 'source-control'
  | 'run-debug'
  | 'extensions'
  | 'containers'

// 사이드바·패널·보조 사이드바를 열고 닫는 상태와 VSCode 단축키
export function useWorkbenchLayout() {
  const [activeView, setActiveView] = useState<SideBarView>('explorer')
  const [isSideBarVisible, setIsSideBarVisible] = useState(true)
  const [isPanelVisible, setIsPanelVisible] = useState(true)
  const [isSecondarySideBarVisible, setIsSecondarySideBarVisible] =
    useState(true)
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)

  const toggleSideBar = () => setIsSideBarVisible((isVisible) => !isVisible)
  const togglePanel = () => setIsPanelVisible((isVisible) => !isVisible)
  const toggleSecondarySideBar = () =>
    setIsSecondarySideBarVisible((isVisible) => !isVisible)
  const showPanel = () => setIsPanelVisible(true)
  const showSecondarySideBar = () => setIsSecondarySideBarVisible(true)
  const openCommandPalette = () => setIsCommandPaletteOpen(true)
  const closeCommandPalette = () => setIsCommandPaletteOpen(false)

  // VSCode처럼 이미 보고 있는 아이콘을 다시 누르면 사이드바를 닫는다
  const selectView = (view: SideBarView) => {
    if (view === activeView && isSideBarVisible) {
      setIsSideBarVisible(false)
      return
    }
    setActiveView(view)
    setIsSideBarVisible(true)
  }

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      const isCommandKey = event.metaKey || event.ctrlKey
      if (!isCommandKey) {
        return
      }
      // Option 키를 같이 누르면 event.key가 특수문자로 바뀌므로 event.code로 비교한다
      if (event.code === 'KeyB' && event.altKey) {
        event.preventDefault()
        setIsSecondarySideBarVisible((isVisible) => !isVisible)
        return
      }
      if (event.code === 'KeyB') {
        event.preventDefault()
        setIsSideBarVisible((isVisible) => !isVisible)
        return
      }
      if (event.code === 'KeyJ') {
        event.preventDefault()
        setIsPanelVisible((isVisible) => !isVisible)
        return
      }
      if (event.code === 'KeyP') {
        event.preventDefault()
        setIsCommandPaletteOpen(true)
      }
    }

    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [])

  return {
    activeView,
    isSideBarVisible,
    isPanelVisible,
    isSecondarySideBarVisible,
    selectView,
    toggleSideBar,
    togglePanel,
    toggleSecondarySideBar,
    showPanel,
    showSecondarySideBar,
    isCommandPaletteOpen,
    openCommandPalette,
    closeCommandPalette,
  }
}
