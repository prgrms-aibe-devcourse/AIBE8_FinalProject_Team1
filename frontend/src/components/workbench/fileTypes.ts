// 확장자별로 에디터 언어, 상태바 언어 이름, 파일 아이콘을 정한다

export type FileType = {
  languageId: string
  languageLabel: string
  iconText: string
  iconColor: string
}

const FILE_TYPES: Record<string, FileType> = {
  mjs: {
    languageId: 'javascript',
    languageLabel: 'JavaScript',
    iconText: 'JS',
    iconColor: '#cbcb41',
  },
  js: {
    languageId: 'javascript',
    languageLabel: 'JavaScript',
    iconText: 'JS',
    iconColor: '#cbcb41',
  },
  ts: {
    languageId: 'typescript',
    languageLabel: 'TypeScript',
    iconText: 'TS',
    iconColor: '#519aba',
  },
}

const PLAIN_TEXT: FileType = {
  languageId: 'plaintext',
  languageLabel: 'Plain Text',
  iconText: '≡',
  iconColor: '#cccccc',
}

export function getFileType(fileName: string): FileType {
  const extension = fileName.split('.').pop() ?? ''
  return FILE_TYPES[extension] ?? PLAIN_TEXT
}
