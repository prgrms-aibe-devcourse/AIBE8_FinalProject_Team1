import { IconButton } from './IconButton'
import type { AgentTab } from './SecondarySideBar'
import { WELCOME_TAB_ID } from './useEditorTabs'
import styles from './EditorTabs.module.css'

type EditorTabsProps = {
  openTabIds: string[]
  activeTabId: string | undefined
  onSelectTab: (tabId: string) => void
  onCloseTab: (tabId: string) => void
  onRun: () => void
  onOpenAgent: (tab: AgentTab) => void
}

export function EditorTabs({
  openTabIds,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onRun,
  onOpenAgent,
}: EditorTabsProps) {
  return (
    <div className={styles.tabBar}>
      <div className={styles.tabs}>
        {openTabIds.map((tabId) => (
          <div
            key={tabId}
            className={tabId === activeTabId ? styles.activeTab : styles.tab}
            onClick={() => onSelectTab(tabId)}
          >
            <TabLabel tabId={tabId} />
            <button
              type="button"
              className={styles.closeButton}
              aria-label={`Close ${tabId}`}
              onClick={(event) => {
                event.stopPropagation()
                onCloseTab(tabId)
              }}
            >
              <i className="codicon codicon-close" />
            </button>
          </div>
        ))}
      </div>
      <div className={styles.actions}>
        <IconButton icon="play" label="Run Code" onClick={onRun} />
        <IconButton
          icon="sparkle"
          label="Open in Claude Code"
          iconClassName={styles.claudeIcon}
          onClick={() => onOpenAgent('claude-code')}
        />
        <IconButton
          icon="robot"
          label="Open in Codex"
          onClick={() => onOpenAgent('codex')}
        />
        <IconButton icon="split-horizontal" label="Split Editor Right (⌘\)" />
        <IconButton icon="ellipsis" label="More Actions..." />
      </div>
    </div>
  )
}

function TabLabel({ tabId }: { tabId: string }) {
  if (tabId === WELCOME_TAB_ID) {
    return (
      <span className={styles.welcomeLabel}>
        <i className="codicon codicon-info" />
        Welcome
      </span>
    )
  }
  return (
    <span className={styles.label}>
      <span className={styles.fileIcon}>TS</span>
      {tabId}
    </span>
  )
}
