import styles from './IconButton.module.css'

type IconButtonProps = {
  icon: string
  label: string
  iconClassName?: string
  onClick?: () => void
}

// 툴바에 쓰는 Codicon 아이콘 버튼
export function IconButton({
  icon,
  label,
  iconClassName = '',
  onClick,
}: IconButtonProps) {
  return (
    <button
      type="button"
      className={styles.iconButton}
      title={label}
      aria-label={label}
      onClick={onClick}
    >
      <i className={`codicon codicon-${icon} ${iconClassName}`} />
    </button>
  )
}
