import { findNewsCategory } from '../../news/newsFiles'
import {
  ARTICLES_VARIABLE_NAME,
  toNewsFileContent,
} from '../../news/toNewsFileContent'
import { FileIcon } from './FileIcon'
import { getFileType } from './fileTypes'
import {
  NewsEditor,
  type CursorPosition,
  type SearchReveal,
} from './NewsEditor'
import type { AgentTab } from './SecondarySideBar'
import { EditorTabs } from './EditorTabs'
import { WELCOME_TAB_ID } from './useEditorTabs'
import { WelcomePage } from './WelcomePage'
import styles from './EditorArea.module.css'

type EditorAreaProps = {
  openTabIds: string[]
  activeTabId: string | undefined
  onOpenFile: (path: string) => void
  onSelectTab: (tabId: string) => void
  onCloseTab: (tabId: string) => void
  dirtyPaths: Set<string>
  searchReveal: SearchReveal | undefined
  onCursorChange: (position: CursorPosition) => void
  onContentChange: (path: string, content: string) => void
  onSave: (path: string, content: string) => void
  onRun: () => void
  onOpenAgent: (tab: AgentTab) => void
}

export function EditorArea({
  openTabIds,
  activeTabId,
  onOpenFile,
  onSelectTab,
  onCloseTab,
  dirtyPaths,
  searchReveal,
  onCursorChange,
  onContentChange,
  onSave,
  onRun,
  onOpenAgent,
}: EditorAreaProps) {
  const isFileOpen = activeTabId !== undefined && activeTabId !== WELCOME_TAB_ID

  return (
    <section className={styles.editorArea}>
      <EditorTabs
        openTabIds={openTabIds}
        activeTabId={activeTabId}
        dirtyPaths={dirtyPaths}
        onSelectTab={onSelectTab}
        onCloseTab={onCloseTab}
        onRun={onRun}
        onOpenAgent={onOpenAgent}
      />
      {activeTabId === WELCOME_TAB_ID && (
        <WelcomePage onOpenFile={onOpenFile} />
      )}
      {isFileOpen && (
        <FileEditor
          path={activeTabId}
          searchReveal={searchReveal}
          onCursorChange={onCursorChange}
          onContentChange={onContentChange}
          onSave={onSave}
        />
      )}
      {activeTabId === undefined && <EmptyEditor />}
    </section>
  )
}

type FileEditorProps = {
  path: string
  searchReveal: SearchReveal | undefined
  onCursorChange: (position: CursorPosition) => void
  onContentChange: (path: string, content: string) => void
  onSave: (path: string, content: string) => void
}

// 뉴스 파일은 기사를 읽기 전용으로, 탐색기에서 만든 파일은 빈 파일로 열어 입력할 수 있다
function FileEditor({
  path,
  searchReveal,
  onCursorChange,
  onContentChange,
  onSave,
}: FileEditorProps) {
  const newsCategory = findNewsCategory(path)
  const pathSegments = path.split('/')
  const fileName = pathSegments[pathSegments.length - 1]

  return (
    <>
      <div className={styles.breadcrumbs}>
        {pathSegments.slice(0, -1).map((folderName, index) => (
          <span key={index} className={styles.breadcrumb}>
            {folderName}
            <i className="codicon codicon-chevron-right" />
          </span>
        ))}
        <FileIcon fileName={fileName} />
        <span>{fileName}</span>
        {newsCategory && (
          <>
            <i className="codicon codicon-chevron-right" />
            <i
              className={`codicon codicon-symbol-variable ${styles.symbolIcon}`}
            />
            <span>{ARTICLES_VARIABLE_NAME}</span>
          </>
        )}
      </div>
      <div className={styles.editor}>
        <NewsEditor
          path={path}
          languageId={getFileType(fileName).languageId}
          content={newsCategory ? toNewsFileContent(newsCategory) : ''}
          isReadOnly={newsCategory !== undefined}
          searchReveal={searchReveal}
          onCursorChange={onCursorChange}
          onContentChange={onContentChange}
          onSave={onSave}
        />
      </div>
    </>
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
