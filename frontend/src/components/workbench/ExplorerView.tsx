import { useState } from 'react'
import { sampleNewsCategories } from '../../news/sampleNews'
import { IconButton } from './IconButton'
import styles from './ExplorerView.module.css'

type ExplorerViewProps = {
  activeTabId: string | undefined
  onOpenFile: (fileName: string) => void
}

const WORKSPACE_NAME = 'news'
const NEWS_FOLDER_NAME = 'src'
const COLLAPSED_SECTIONS = ['Outline', 'Timeline']

// 카테고리별 뉴스 파일을 VSCode 탐색기 트리처럼 보여준다
export function ExplorerView({ activeTabId, onOpenFile }: ExplorerViewProps) {
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(true)
  const [isFolderOpen, setIsFolderOpen] = useState(true)

  return (
    <div className={styles.explorerView}>
      <div className={styles.tree}>
        <div className={styles.workspaceHeader}>
          <button
            type="button"
            className={styles.sectionHeader}
            onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
          >
            <i
              className={`codicon codicon-chevron-${isWorkspaceOpen ? 'down' : 'right'}`}
            />
            {WORKSPACE_NAME}
          </button>
          <div className={styles.headerActions}>
            <IconButton icon="new-file" label="New File..." />
            <IconButton icon="new-folder" label="New Folder..." />
            <IconButton icon="refresh" label="Refresh Explorer" />
            <IconButton
              icon="collapse-all"
              label="Collapse Folders in Explorer"
            />
          </div>
        </div>

        {isWorkspaceOpen && (
          <>
            <button
              type="button"
              className={styles.row}
              onClick={() => setIsFolderOpen(!isFolderOpen)}
            >
              <i
                className={`codicon codicon-chevron-${isFolderOpen ? 'down' : 'right'}`}
              />
              {NEWS_FOLDER_NAME}
            </button>
            {isFolderOpen &&
              sampleNewsCategories.map((category) => (
                <button
                  key={category.fileName}
                  type="button"
                  className={
                    category.fileName === activeTabId
                      ? styles.activeFileRow
                      : styles.fileRow
                  }
                  onClick={() => onOpenFile(category.fileName)}
                >
                  <span className={styles.fileIcon}>TS</span>
                  {category.fileName}
                </button>
              ))}
          </>
        )}
      </div>

      {COLLAPSED_SECTIONS.map((section) => (
        <button key={section} type="button" className={styles.sectionHeader}>
          <i className="codicon codicon-chevron-right" />
          {section}
        </button>
      ))}
    </div>
  )
}
