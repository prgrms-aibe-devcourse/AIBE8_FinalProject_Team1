import { getFileType } from './fileTypes'
import type { CursorPosition } from './NewsEditor'
import { WELCOME_TAB_ID } from './useEditorTabs'
import styles from './StatusBar.module.css'

type StatusBarProps = {
  activeTabId: string | undefined
  cursorPosition: CursorPosition
  hasNewsLoadError: boolean
}

const BRANCH_NAME = 'main'
const FILE_INFO_ITEMS = ['Spaces: 2', 'UTF-8', 'LF']

export function StatusBar({
  activeTabId,
  cursorPosition,
  hasNewsLoadError,
}: StatusBarProps) {
  const isFileOpen = activeTabId !== undefined && activeTabId !== WELCOME_TAB_ID

  return (
    <footer className={styles.statusBar}>
      <div className={styles.side}>
        <span className={styles.remote}>
          <i className="codicon codicon-remote" />
        </span>
        <span className={styles.item}>
          <i className="codicon codicon-git-branch" />
          {BRANCH_NAME}
        </span>
        <span className={styles.item}>
          <i className="codicon codicon-error" />0
          <i className="codicon codicon-warning" />0
        </span>
        {hasNewsLoadError && (
          <span className={styles.item}>
            <i className="codicon codicon-warning" />
            Failed to load news
          </span>
        )}
      </div>
      <div className={styles.side}>
        {isFileOpen && (
          <>
            <span className={styles.item}>
              Ln {cursorPosition.lineNumber}, Col {cursorPosition.column}
            </span>
            {FILE_INFO_ITEMS.map((info) => (
              <span key={info} className={styles.item}>
                {info}
              </span>
            ))}
            <span className={styles.item}>
              {'{ } '}
              {getFileType(activeTabId).languageLabel}
            </span>
          </>
        )}
        <span className={styles.item}>
          <i className="codicon codicon-bell" />
        </span>
      </div>
    </footer>
  )
}
