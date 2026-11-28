import { useEffect } from 'react'
import styles from './ContextMenu.module.css'

export type ContextMenuItem =
  { label: string; isDisabled?: boolean; onSelect: () => void } | 'separator'

type ContextMenuProps = {
  x: number
  y: number
  items: ContextMenuItem[]
  onClose: () => void
}

// 브라우저 기본 우클릭 메뉴 대신 보여주는 VSCode 모양 메뉴
export function ContextMenu({ x, y, items, onClose }: ContextMenuProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('click', onClose)
    window.addEventListener('blur', onClose)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('click', onClose)
      window.removeEventListener('blur', onClose)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  return (
    <ul className={styles.contextMenu} style={{ left: x, top: y }} role="menu">
      {items.map((item, index) =>
        item === 'separator' ? (
          <li key={`separator-${index}`} className={styles.separator} />
        ) : (
          <li key={item.label}>
            <button
              type="button"
              className={styles.item}
              disabled={item.isDisabled}
              onClick={item.onSelect}
            >
              {item.label}
            </button>
          </li>
        ),
      )}
    </ul>
  )
}
