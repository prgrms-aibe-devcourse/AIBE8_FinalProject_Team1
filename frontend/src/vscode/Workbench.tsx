import { useState } from 'react'
import { ActivityBar } from './ActivityBar'
import { CommandPalette } from './CommandPalette'
import { EditorArea } from './EditorArea'
import { ExplorerView } from './ExplorerView'
import { Panel } from './Panel'
import { SecondarySideBar, type AgentTab } from './SecondarySideBar'
import { SideBar } from './SideBar'
import { StatusBar } from './StatusBar'
import { TitleBar } from './TitleBar'
import { useDirtyFiles } from './useDirtyFiles'
import { useEditorTabs } from './useEditorTabs'
import { useExplorerTree, type ExplorerNodeKind } from './useExplorerTree'
import { useNewsCategories } from '../domains/news/useNewsCategories'
import { useWorkbenchLayout } from './useWorkbenchLayout'
import type { CursorPosition, SearchReveal } from './NewsEditor'
import { moveFileContents, restoreFileContent } from './editorModels'
import type { NewsLineMatch } from '../domains/news/searchNews'
import styles from './Workbench.module.css'

const START_CURSOR_POSITION: CursorPosition = { lineNumber: 1, column: 1 }

// VSCode 화면 전체 배치. 각 영역의 열림 상태와 열린 탭을 여기서 관리한다
export function Workbench() {
  const news = useNewsCategories()
  const layout = useWorkbenchLayout()
  const editorTabs = useEditorTabs()
  const explorerTree = useExplorerTree(news.categories)
  const dirtyFiles = useDirtyFiles()
  const [cursorPosition, setCursorPosition] = useState(START_CURSOR_POSITION)
  const [agentTab, setAgentTab] = useState<AgentTab>('codex')
  const [searchReveal, setSearchReveal] = useState<SearchReveal>()

  // 에디터의 Codex·Claude Code 버튼을 누르면 AI agent 창을 열고 그 탭을 보여준다
  const openAgent = (tab: AgentTab) => {
    setAgentTab(tab)
    layout.showSecondarySideBar()
  }

  const openFileFromPalette = (path: string) => {
    editorTabs.openTab(path)
    layout.closeCommandPalette()
  }

  // Command Palette에서 고른 줄이 있는 파일을 열고, 에디터가 그 줄로 이동하게 한다
  const revealSearchMatch = (match: NewsLineMatch, keyword: string) => {
    editorTabs.openTab(match.path)
    setSearchReveal({
      requestId: Date.now(),
      path: match.path,
      lineNumber: match.lineNumber,
      column: match.column,
      keyword,
    })
    layout.closeCommandPalette()
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
      dirtyFiles.renameFiles(path, newPath)
      moveFileContents(path, newPath)
    }
  }

  const deleteExplorerNode = (path: string) => {
    if (explorerTree.deleteNode(path)) {
      editorTabs.closeTabsOf(path)
      dirtyFiles.forgetFiles(path)
    }
  }

  // VSCode는 저장 안 한 탭을 닫을 때 물어보지만, 여기서는 고친 내용을 버리고 닫는다
  const closeEditorTab = (tabId: string) => {
    if (dirtyFiles.dirtyPaths.has(tabId)) {
      restoreFileContent(tabId, dirtyFiles.getSavedContent(tabId))
      dirtyFiles.discardChanges(tabId)
    }
    editorTabs.closeTab(tabId)
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
        onOpenCommandPalette={layout.openCommandPalette}
      />
      <div className={styles.main}>
        <ActivityBar
          activeView={layout.isSideBarVisible ? layout.activeView : undefined}
          onSelectView={layout.selectView}
          dirtyFileCount={dirtyFiles.dirtyPaths.size}
          onOpenClaudeCode={() => openAgent('claude-code')}
        />
        {layout.isSideBarVisible && (
          <SideBar
            activeView={layout.activeView}
            explorer={
              <ExplorerView
                activeTabId={editorTabs.activeTabId}
                getChildren={explorerTree.getChildren}
                isProtected={explorerTree.isProtected}
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
            newsCategories={news.categories}
            openTabIds={editorTabs.openTabIds}
            activeTabId={editorTabs.activeTabId}
            onOpenFile={editorTabs.openTab}
            onSelectTab={editorTabs.selectTab}
            onCloseTab={closeEditorTab}
            dirtyPaths={dirtyFiles.dirtyPaths}
            searchReveal={searchReveal}
            onCursorChange={setCursorPosition}
            onContentChange={dirtyFiles.changeContent}
            onSave={dirtyFiles.saveFile}
            onRun={layout.showPanel}
            onOpenAgent={openAgent}
          />
          {layout.isPanelVisible && (
            <Panel
              newsCategories={news.categories}
              onClose={layout.togglePanel}
            />
          )}
        </div>
        {layout.isSecondarySideBarVisible && (
          <SecondarySideBar
            activeTab={agentTab}
            onSelectTab={setAgentTab}
            onClose={layout.toggleSecondarySideBar}
          />
        )}
      </div>
      {layout.isCommandPaletteOpen && (
        <CommandPalette
          newsCategories={news.categories}
          onOpenFile={openFileFromPalette}
          onSelectMatch={revealSearchMatch}
          onClose={layout.closeCommandPalette}
        />
      )}
      <StatusBar
        activeTabId={editorTabs.activeTabId}
        cursorPosition={cursorPosition}
        hasNewsLoadError={news.hasLoadError}
      />
    </div>
  )
}
