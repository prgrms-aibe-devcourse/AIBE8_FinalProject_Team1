import { ReactFileIcon } from '../icons/ReactFileIcon'
import { REACT_ICON, getFileType } from './fileTypes'
import styles from './FileIcon.module.css'

type FileIconProps = {
  fileName: string
}

export function FileIcon({ fileName }: FileIconProps) {
  const fileType = getFileType(fileName)

  if (fileType.iconText === REACT_ICON) {
    return (
      <span className={styles.fileIcon}>
        <ReactFileIcon color={fileType.iconColor} />
      </span>
    )
  }
  return (
    <span className={styles.fileIcon} style={{ color: fileType.iconColor }}>
      {fileType.iconText}
    </span>
  )
}
