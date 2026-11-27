import { ExplorerView } from './ExplorerView'
import { PlaceholderView, type PlaceholderViewContent } from './PlaceholderView'
import type { SideBarView } from './useWorkbenchLayout'
import styles from './SideBar.module.css'

type SideBarProps = {
  activeView: SideBarView
  activeTabId: string | undefined
  onOpenFile: (fileName: string) => void
}

const VIEW_TITLES: Record<SideBarView, string> = {
  explorer: 'Explorer',
  search: 'Search',
  'source-control': 'Source Control',
  'run-debug': 'Run and Debug: Run',
  extensions: 'Extensions',
}

// 탐색기 외의 화면은 VSCode 모양만 보여준다
const PLACEHOLDER_CONTENTS: Record<
  Exclude<SideBarView, 'explorer'>,
  PlaceholderViewContent
> = {
  search: { inputPlaceholder: 'Search' },
  'source-control': {
    message: 'The folder currently open doesn’t have a git repository.',
    buttonLabel: 'Initialize Repository',
  },
  'run-debug': {
    message: 'Open a file which can be debugged or run.',
    buttonLabel: 'Run and Debug',
  },
  extensions: { inputPlaceholder: 'Search Extensions in Marketplace' },
}

export function SideBar({ activeView, activeTabId, onOpenFile }: SideBarProps) {
  return (
    <aside className={styles.sideBar}>
      <div className={styles.title}>
        <span>{VIEW_TITLES[activeView]}</span>
        <i className="codicon codicon-ellipsis" />
      </div>
      {activeView === 'explorer' ? (
        <ExplorerView activeTabId={activeTabId} onOpenFile={onOpenFile} />
      ) : (
        <PlaceholderView content={PLACEHOLDER_CONTENTS[activeView]} />
      )}
    </aside>
  )
}
