import { useState, type FormEvent, type ReactElement } from 'react'
import { ClaudeCodeIcon } from './icons/ClaudeCodeIcon'
import { CodexIcon } from './icons/CodexIcon'
import { IconButton } from './IconButton'
import styles from './SecondarySideBar.module.css'

export type AgentTab = 'codex' | 'claude-code'

// 노션 요구사항: Codex 탭은 익명 전체 채팅, Claude Code 탭은 친구와 1:1 채팅
const AGENT_TABS: {
  tab: AgentTab
  label: string
  icon: ReactElement
  emptyMessage: string
}[] = [
  {
    tab: 'codex',
    label: 'Codex',
    icon: <CodexIcon />,
    emptyMessage: 'Chat anonymously with everyone online.',
  },
  {
    tab: 'claude-code',
    label: 'Claude Code',
    icon: <ClaudeCodeIcon />,
    emptyMessage: 'Pick a friend to start a private chat.',
  },
]

const EMPTY_MESSAGES: Record<AgentTab, string[]> = {
  codex: [],
  'claude-code': [],
}

type SecondarySideBarProps = {
  activeTab: AgentTab
  onSelectTab: (tab: AgentTab) => void
  onClose: () => void
}

// AI agent 창 모양의 채팅. 서버 연결은 채팅 이슈에서 붙이고,
// 지금은 입력한 메시지를 탭별로 화면에만 쌓는다
export function SecondarySideBar({
  activeTab,
  onSelectTab,
  onClose,
}: SecondarySideBarProps) {
  const [messagesByTab, setMessagesByTab] = useState(EMPTY_MESSAGES)
  const [draft, setDraft] = useState('')

  const activeTabInfo = AGENT_TABS.find(
    (agentTab) => agentTab.tab === activeTab,
  )
  const messages = messagesByTab[activeTab]

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const message = draft.trim()
    if (message === '') {
      return
    }
    setMessagesByTab({ ...messagesByTab, [activeTab]: [...messages, message] })
    setDraft('')
  }

  return (
    <aside className={styles.secondarySideBar}>
      <div className={styles.header}>
        <div className={styles.tabs}>
          {AGENT_TABS.map((agentTab) => (
            <button
              key={agentTab.tab}
              type="button"
              className={
                agentTab.tab === activeTab ? styles.activeTab : styles.tab
              }
              onClick={() => onSelectTab(agentTab.tab)}
            >
              {agentTab.icon}
              {agentTab.label}
            </button>
          ))}
        </div>
        <div className={styles.actions}>
          <IconButton icon="add" label="New Chat" />
          <IconButton icon="history" label="Show Chats..." />
          <IconButton icon="ellipsis" label="More Actions..." />
          <IconButton
            icon="close"
            label="Hide Secondary Side Bar (⌥⌘B)"
            onClick={onClose}
          />
        </div>
      </div>

      <div className={styles.messages}>
        {messages.length === 0 ? (
          <p className={styles.emptyMessage}>{activeTabInfo?.emptyMessage}</p>
        ) : (
          messages.map((message, index) => (
            <p key={index} className={styles.message}>
              {message}
            </p>
          ))
        )}
      </div>

      <form className={styles.inputBox} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          value={draft}
          placeholder="Ask a question or type / for commands"
          onChange={(event) => setDraft(event.target.value)}
        />
        <button type="submit" className={styles.sendButton} aria-label="Send">
          <i className="codicon codicon-send" />
        </button>
      </form>
    </aside>
  )
}
