import type { ReactNode } from 'react'
import { ClaudeCodeIcon } from './icons/ClaudeCodeIcon'
import type { SideBarView } from './useWorkbenchLayout'
import styles from './ActivityBar.module.css'

type ActivityBarProps = {
  activeView: SideBarView | undefined
  onSelectView: (view: SideBarView) => void
  dirtyFileCount: number
  onOpenClaudeCode: () => void
}

type ViewItem = {
  view: SideBarView
  icon: string
  label: string
}

const MAIN_VIEW_ITEMS: ViewItem[] = [
  { view: 'explorer', icon: 'files', label: 'Explorer (⇧⌘E)' },
  { view: 'search', icon: 'search', label: 'Search (⇧⌘F)' },
  {
    view: 'source-control',
    icon: 'source-control',
    label: 'Source Control (⌃⇧G)',
  },
  { view: 'run-debug', icon: 'debug-alt', label: 'Run and Debug (⇧⌘D)' },
  { view: 'extensions', icon: 'extensions', label: 'Extensions (⇧⌘X)' },
]

const CONTAINERS_ITEM: ViewItem = {
  view: 'containers',
  icon: 'package',
  label: 'Containers',
}

export function ActivityBar({
  activeView,
  onSelectView,
  dirtyFileCount,
  onOpenClaudeCode,
}: ActivityBarProps) {
  // VSCode의 DirtyFilesIndicator처럼 저장 안 한 파일이 있을 때만 탐색기에 숫자를 띄운다
  const toBadge = (view: SideBarView) =>
    view === 'explorer' && dirtyFileCount > 0 ? dirtyFileCount : undefined
  const toLabel = (item: ViewItem) =>
    toBadge(item.view) === undefined
      ? item.label
      : `${item.label} - ${dirtyFileCount} unsaved file${dirtyFileCount > 1 ? 's' : ''}`

  const renderViewItem = (item: ViewItem) => (
    <ActivityItem
      key={item.view}
      label={toLabel(item)}
      isActive={item.view === activeView}
      badgeCount={toBadge(item.view)}
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
        <ActivityItem label="Manage" isActive={false}>
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
