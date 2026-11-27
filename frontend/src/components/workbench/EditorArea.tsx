import { sampleNewsCategories } from '../../news/sampleNews'
import { toNewsFileContent } from '../../news/toNewsFileContent'
import { NewsEditor, type CursorPosition } from './NewsEditor'
import type { AgentTab } from './SecondarySideBar'
import { EditorTabs } from './EditorTabs'
import { WELCOME_TAB_ID } from './useEditorTabs'
import { WelcomePage } from './WelcomePage'
import styles from './EditorArea.module.css'

type EditorAreaProps = {
  openTabIds: string[]
  activeTabId: string | undefined
  onOpenFile: (fileName: string) => void
  onSelectTab: (tabId: string) => void
  onCloseTab: (tabId: string) => void
  onCursorChange: (position: CursorPosition) => void
  onRun: () => void
  onOpenAgent: (tab: AgentTab) => void
}

const FOLDER_NAME = 'src'

export function EditorArea({
  openTabIds,
  activeTabId,
  onOpenFile,
  onSelectTab,
  onCloseTab,
  onCursorChange,
  onRun,
  onOpenAgent,
}: EditorAreaProps) {
  const activeCategory = sampleNewsCategories.find(
    (category) => category.fileName === activeTabId,
  )

  return (
    <section className={styles.editorArea}>
      <EditorTabs
        openTabIds={openTabIds}
        activeTabId={activeTabId}
        onSelectTab={onSelectTab}
        onCloseTab={onCloseTab}
        onRun={onRun}
        onOpenAgent={onOpenAgent}
      />
      {activeTabId === WELCOME_TAB_ID && (
        <WelcomePage onOpenFile={onOpenFile} />
      )}
      {activeCategory && (
        <>
          <div className={styles.breadcrumbs}>
            <span>{FOLDER_NAME}</span>
            <i className="codicon codicon-chevron-right" />
            <span className={styles.fileIcon}>TS</span>
            <span>{activeCategory.fileName}</span>
          </div>
          <div className={styles.editor}>
            <NewsEditor
              fileName={activeCategory.fileName}
              content={toNewsFileContent(activeCategory)}
              onCursorChange={onCursorChange}
            />
          </div>
        </>
      )}
      {activeTabId === undefined && <EmptyEditor />}
    </section>
  )
}

const EMPTY_EDITOR_SHORTCUTS = [
  { label: 'Show All Commands', keys: '⇧⌘P' },
  { label: 'Go to File', keys: '⌘P' },
  { label: 'Find in Files', keys: '⇧⌘F' },
  { label: 'Toggle Terminal', keys: '⌃`' },
]

// 탭을 모두 닫았을 때 보이는 단축키 안내
function EmptyEditor() {
  return (
    <div className={styles.emptyEditor}>
      {EMPTY_EDITOR_SHORTCUTS.map((shortcut) => (
        <div key={shortcut.label} className={styles.shortcut}>
          <span>{shortcut.label}</span>
          <kbd>{shortcut.keys}</kbd>
        </div>
      ))}
    </div>
  )
}
