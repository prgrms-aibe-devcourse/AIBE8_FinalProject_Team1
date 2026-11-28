import { useState } from 'react'
import type { NewsCategory } from '../../api/news'
import { IconButton } from './IconButton'
import { NewsTerminal } from './NewsTerminal'
import styles from './Panel.module.css'

type PanelProps = {
  newsCategories: NewsCategory[]
  onClose: () => void
}

type PanelTab = 'problems' | 'output' | 'debug-console' | 'terminal' | 'ports'

const PANEL_TABS: { tab: PanelTab; label: string; emptyMessage: string }[] = [
  {
    tab: 'problems',
    label: 'Problems',
    emptyMessage: 'No problems have been detected in the workspace.',
  },
  { tab: 'output', label: 'Output', emptyMessage: '' },
  {
    tab: 'debug-console',
    label: 'Debug Console',
    emptyMessage: 'Please start a debug session to evaluate expressions',
  },
  { tab: 'terminal', label: 'Terminal', emptyMessage: '' },
  {
    tab: 'ports',
    label: 'Ports',
    emptyMessage:
      'No forwarded ports. Forward a port to access your running services locally.',
  },
]

// 다른 탭을 보고 와도 터미널 내용이 남도록, 터미널은 숨기기만 하고 계속 띄워 둔다
export function Panel({ newsCategories, onClose }: PanelProps) {
  const [activeTab, setActiveTab] = useState<PanelTab>('terminal')
  const activeTabInfo = PANEL_TABS.find(
    (panelTab) => panelTab.tab === activeTab,
  )

  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.tabs}>
          {PANEL_TABS.map((panelTab) => (
            <button
              key={panelTab.tab}
              type="button"
              className={
                panelTab.tab === activeTab ? styles.activeTab : styles.tab
              }
              onClick={() => setActiveTab(panelTab.tab)}
            >
              {panelTab.label}
            </button>
          ))}
        </div>
        <div className={styles.actions}>
          {activeTab === 'terminal' && (
            <>
              <span className={styles.shellName}>
                <i className="codicon codicon-terminal" />
                zsh
              </span>
              <IconButton icon="add" label="New Terminal (⌃⇧`)" />
              <IconButton icon="split-horizontal" label="Split Terminal (⌘\)" />
              <IconButton icon="trash" label="Kill Terminal" />
            </>
          )}
          <IconButton icon="ellipsis" label="Views and More Actions..." />
          <IconButton icon="screen-full" label="Maximize Panel Size" />
          <IconButton icon="close" label="Hide Panel (⌘J)" onClick={onClose} />
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.terminal} hidden={activeTab !== 'terminal'}>
          <NewsTerminal newsCategories={newsCategories} />
        </div>
        {activeTab !== 'terminal' && (
          <p className={styles.emptyMessage}>{activeTabInfo?.emptyMessage}</p>
        )}
      </div>
    </section>
  )
}
