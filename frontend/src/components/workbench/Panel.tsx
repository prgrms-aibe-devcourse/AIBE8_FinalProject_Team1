import { useState } from 'react'
import { IconButton } from './IconButton'
import styles from './Panel.module.css'

type PanelProps = {
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

const TERMINAL_PROMPT = 'dev@readme news % '

// 터미널은 자리만 만든다. 명령어 입력은 xterm.js 이슈에서 붙인다
export function Panel({ onClose }: PanelProps) {
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
        {activeTab === 'terminal' ? (
          <div className={styles.terminal}>
            {TERMINAL_PROMPT}
            <span className={styles.cursor} />
          </div>
        ) : (
          <p className={styles.emptyMessage}>{activeTabInfo?.emptyMessage}</p>
        )}
      </div>
    </section>
  )
}
