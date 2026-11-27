import type { ReactNode } from 'react'
import { ClaudeCodeIcon } from '../icons/ClaudeCodeIcon'
import type { SideBarView } from './useWorkbenchLayout'
import styles from './ActivityBar.module.css'

type ActivityBarProps = {
  activeView: SideBarView | undefined
  onSelectView: (view: SideBarView) => void
  onOpenClaudeCode: () => void
}

type ViewItem = {
  view: SideBarView
  icon: string
  label: string
  badgeCount?: number
}

const MAIN_VIEW_ITEMS: ViewItem[] = [
  { view: 'explorer', icon: 'files', label: 'Explorer (⇧⌘E)', badgeCount: 1 },
  { view: 'search', icon: 'search', label: 'Search (⇧⌘F)' },
  {
    view: 'source-control',
    icon: 'source-control',
    label: 'Source Control (⌃⇧G)',
  },
  { view: 'run-debug', icon: 'debug-alt', label: 'Run and Debug (⇧⌘D)' },
  {
    view: 'extensions',
    icon: 'extensions',
    label: 'Extensions (⇧⌘X)',
    badgeCount: 1,
  },
]

const CONTAINERS_ITEM: ViewItem = {
  view: 'containers',
  icon: 'package',
  label: 'Containers',
}

export function ActivityBar({
  activeView,
  onSelectView,
  onOpenClaudeCode,
}: ActivityBarProps) {
  const renderViewItem = (item: ViewItem) => (
    <ActivityItem
      key={item.view}
      label={item.label}
      isActive={item.view === activeView}
      badgeCount={item.badgeCount}
      onClick={() => onSelectView(item.view)}
    >
      <i className={`codicon codicon-${item.icon}`} />
    </ActivityItem>
  )

  return (
    <nav className={styles.activityBar}>
      <div className={styles.items}>
        {MAIN_VIEW_ITEMS.map(renderViewItem)}
        <ActivityItem
          label="Claude Code"
          isActive={false}
          onClick={onOpenClaudeCode}
        >
          <span className={styles.claudeCodeIcon}>
            <ClaudeCodeIcon size={22} />
          </span>
        </ActivityItem>
        {renderViewItem(CONTAINERS_ITEM)}
      </div>
      <div className={styles.items}>
        <ActivityItem label="Accounts" isActive={false}>
          <i className="codicon codicon-account" />
        </ActivityItem>
        <ActivityItem label="Manage" isActive={false} badgeCount={1}>
          <i className="codicon codicon-settings-gear" />
        </ActivityItem>
      </div>
    </nav>
  )
}

type ActivityItemProps = {
  label: string
  isActive: boolean
  badgeCount?: number
  onClick?: () => void
  children: ReactNode
}

function ActivityItem({
  label,
  isActive,
  badgeCount,
  onClick,
  children,
}: ActivityItemProps) {
  return (
    <button
      type="button"
      className={isActive ? styles.activeItem : styles.item}
      title={label}
      aria-label={label}
      onClick={onClick}
    >
      {children}
      {badgeCount !== undefined && (
        <span className={styles.badge}>{badgeCount}</span>
      )}
    </button>
  )
}
