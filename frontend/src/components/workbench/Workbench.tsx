import { useState } from 'react'
import { ActivityBar } from './ActivityBar'
import { EditorArea } from './EditorArea'
import { ExplorerView } from './ExplorerView'
import { Panel } from './Panel'
import { SecondarySideBar, type AgentTab } from './SecondarySideBar'
import { SideBar } from './SideBar'
import { StatusBar } from './StatusBar'
import { TitleBar } from './TitleBar'
import { useEditorTabs } from './useEditorTabs'
import { useExplorerTree, type ExplorerNodeKind } from './useExplorerTree'
import { useWorkbenchLayout } from './useWorkbenchLayout'
import type { CursorPosition } from './NewsEditor'
import styles from './Workbench.module.css'

const START_CURSOR_POSITION: CursorPosition = { lineNumber: 1, column: 1 }

// VSCode 화면 전체 배치. 각 영역의 열림 상태와 열린 탭을 여기서 관리한다
export function Workbench() {
  const layout = useWorkbenchLayout()
  const editorTabs = useEditorTabs()
  const explorerTree = useExplorerTree()
  const [cursorPosition, setCursorPosition] = useState(START_CURSOR_POSITION)
  const [agentTab, setAgentTab] = useState<AgentTab>('codex')

  // 에디터의 Codex·Claude Code 버튼을 누르면 AI agent 창을 열고 그 탭을 보여준다
  const openAgent = (tab: AgentTab) => {
    setAgentTab(tab)
    layout.showSecondarySideBar()
  }

  // 탐색기에서 파일을 만들거나 바꾸거나 지우면 열린 탭도 맞춰 준다
  const createExplorerNode = (
    parentPath: string,
    name: string,
    kind: ExplorerNodeKind,
  ) => {
    const path = explorerTree.createNode(parentPath, name, kind)
    if (path !== undefined && kind === 'file') {
      editorTabs.openTab(path)
    }
  }

  const renameExplorerNode = (path: string, newName: string) => {
    const newPath = explorerTree.renameNode(path, newName)
    if (newPath !== undefined) {
      editorTabs.renameTabsOf(path, newPath)
    }
  }

  const deleteExplorerNode = (path: string) => {
    if (explorerTree.deleteNode(path)) {
      editorTabs.closeTabsOf(path)
    }
  }

  return (
    <div className={styles.workbench}>
      <TitleBar
        isSideBarVisible={layout.isSideBarVisible}
        isPanelVisible={layout.isPanelVisible}
        isSecondarySideBarVisible={layout.isSecondarySideBarVisible}
        onToggleSideBar={layout.toggleSideBar}
        onTogglePanel={layout.togglePanel}
        onToggleSecondarySideBar={layout.toggleSecondarySideBar}
      />
      <div className={styles.main}>
        <ActivityBar
          activeView={layout.isSideBarVisible ? layout.activeView : undefined}
          onSelectView={layout.selectView}
        />
        {layout.isSideBarVisible && (
          <SideBar
            activeView={layout.activeView}
            explorer={
              <ExplorerView
                activeTabId={editorTabs.activeTabId}
                getChildren={explorerTree.getChildren}
                onOpenFile={editorTabs.openTab}
                onCreateNode={createExplorerNode}
                onRenameNode={renameExplorerNode}
                onDeleteNode={deleteExplorerNode}
              />
            }
          />
        )}
        <div className={styles.center}>
          <EditorArea
            openTabIds={editorTabs.openTabIds}
            activeTabId={editorTabs.activeTabId}
            onOpenFile={editorTabs.openTab}
            onSelectTab={editorTabs.selectTab}
            onCloseTab={editorTabs.closeTab}
            onCursorChange={setCursorPosition}
            onRun={layout.showPanel}
            onOpenAgent={openAgent}
          />
          {layout.isPanelVisible && <Panel onClose={layout.togglePanel} />}
        </div>
        {layout.isSecondarySideBarVisible && (
          <SecondarySideBar
            activeTab={agentTab}
            onSelectTab={setAgentTab}
            onClose={layout.toggleSecondarySideBar}
          />
        )}
      </div>
      <StatusBar
        activeTabId={editorTabs.activeTabId}
        cursorPosition={cursorPosition}
      />
    </div>
  )
}
