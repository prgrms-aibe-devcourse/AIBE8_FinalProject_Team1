import styles from './PlaceholderView.module.css'

export type PlaceholderViewContent = {
  inputPlaceholder?: string
  message?: string
  buttonLabel?: string
}

type PlaceholderViewProps = {
  content: PlaceholderViewContent
}

export function PlaceholderView({ content }: PlaceholderViewProps) {
  return (
    <div className={styles.placeholderView}>
      {content.inputPlaceholder && (
        <input
          className={styles.input}
          placeholder={content.inputPlaceholder}
        />
      )}
      {content.message && <p className={styles.message}>{content.message}</p>}
      {content.buttonLabel && (
        <button type="button" className={styles.button}>
          {content.buttonLabel}
        </button>
      )}
    </div>
  )
}
