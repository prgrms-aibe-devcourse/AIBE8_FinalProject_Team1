import type { SideBarView } from './useWorkbenchLayout'
import styles from './ActivityBar.module.css'

type ActivityBarProps = {
  activeView: SideBarView | undefined
  onSelectView: (view: SideBarView) => void
}

const VIEW_ITEMS: { view: SideBarView; icon: string; label: string }[] = [
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

export function ActivityBar({ activeView, onSelectView }: ActivityBarProps) {
  return (
    <nav className={styles.activityBar}>
      <div className={styles.items}>
        {VIEW_ITEMS.map((item) => (
          <button
            key={item.view}
            type="button"
            className={
              item.view === activeView ? styles.activeItem : styles.item
            }
            title={item.label}
            aria-label={item.label}
            onClick={() => onSelectView(item.view)}
          >
            <i className={`codicon codicon-${item.icon}`} />
          </button>
        ))}
      </div>
      <div className={styles.items}>
        <button
          type="button"
          className={styles.item}
          title="Accounts"
          aria-label="Accounts"
        >
          <i className="codicon codicon-account" />
        </button>
        <button
          type="button"
          className={styles.item}
          title="Manage"
          aria-label="Manage"
        >
          <i className="codicon codicon-settings-gear" />
        </button>
      </div>
    </nav>
  )
}
