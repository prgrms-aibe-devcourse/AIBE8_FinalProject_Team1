import type { ReactElement } from 'react'
import styles from './IconButton.module.css'

type IconButtonProps = {
  // 문자열이면 Codicon 이름, 아니면 직접 그린 아이콘 컴포넌트
  icon: string | ReactElement
  label: string
  onClick?: () => void
}

// 툴바에 쓰는 아이콘 버튼
export function IconButton({ icon, label, onClick }: IconButtonProps) {
  return (
    <button
      type="button"
      className={styles.iconButton}
      title={label}
      aria-label={label}
      onClick={onClick}
    >
      {typeof icon === 'string' ? (
        <i className={`codicon codicon-${icon}`} />
      ) : (
        icon
      )}
    </button>
  )
}
