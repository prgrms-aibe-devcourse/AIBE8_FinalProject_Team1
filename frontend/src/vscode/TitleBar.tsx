import { IconButton } from './IconButton'
import styles from './TitleBar.module.css'

type TitleBarProps = {
  isSideBarVisible: boolean
  isPanelVisible: boolean
  isSecondarySideBarVisible: boolean
  onToggleSideBar: () => void
  onTogglePanel: () => void
  onToggleSecondarySideBar: () => void
  onOpenCommandPalette: () => void
}

const WORKSPACE_NAME = 'news'

export function TitleBar({
  isSideBarVisible,
  isPanelVisible,
  isSecondarySideBarVisible,
  onToggleSideBar,
  onTogglePanel,
  onToggleSecondarySideBar,
  onOpenCommandPalette,
}: TitleBarProps) {
  return (
    <header className={styles.titleBar}>
      <div className={styles.left}>
        <IconButton icon="menu" label="Application Menu" />
      </div>

      <div className={styles.center}>
        <IconButton icon="arrow-left" label="Go Back" />
        <IconButton icon="arrow-right" label="Go Forward" />
        <button
          type="button"
          className={styles.commandCenter}
          title="Search news (⌘P)"
          onClick={onOpenCommandPalette}
        >
          <i className="codicon codicon-search" />
          <span>{WORKSPACE_NAME}</span>
        </button>
      </div>

      <div className={styles.right}>
        <IconButton icon="layout" label="Customize Layout..." />
        <IconButton
          icon={
            isSideBarVisible ? 'layout-sidebar-left' : 'layout-sidebar-left-off'
          }
          label="Toggle Primary Side Bar (⌘B)"
          onClick={onToggleSideBar}
        />
        <IconButton
          icon={isPanelVisible ? 'layout-panel' : 'layout-panel-off'}
          label="Toggle Panel (⌘J)"
          onClick={onTogglePanel}
        />
        <IconButton
          icon={
            isSecondarySideBarVisible
              ? 'layout-sidebar-right'
              : 'layout-sidebar-right-off'
          }
          label="Toggle Secondary Side Bar (⌥⌘B)"
          onClick={onToggleSecondarySideBar}
        />
      </div>
    </header>
  )
}
