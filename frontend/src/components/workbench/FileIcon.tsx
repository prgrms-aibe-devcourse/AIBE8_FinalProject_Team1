import { getFileType } from './fileTypes'
import styles from './FileIcon.module.css'

type FileIconProps = {
  fileName: string
}

export function FileIcon({ fileName }: FileIconProps) {
  const fileType = getFileType(fileName)

  return (
    <span className={styles.fileIcon} style={{ color: fileType.iconColor }}>
      {fileType.iconText}
    </span>
  )
}
