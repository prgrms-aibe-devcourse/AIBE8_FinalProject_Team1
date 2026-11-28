// 확장자별로 에디터 언어, 상태바 언어 이름, 파일 아이콘을 정한다

export type FileType = {
  languageId: string
  languageLabel: string
  iconText: string
  iconColor: string
}

const JAVASCRIPT: FileType = {
  languageId: 'javascript',
  languageLabel: 'JavaScript',
  iconText: 'JS',
  iconColor: '#cbcb41',
}

// FileIcon이 이 값을 보면 글자 대신 원자 모양 SVG를 그린다
export const REACT_ICON = 'react'

const YAML: FileType = {
  languageId: 'yaml',
  languageLabel: 'YAML',
  iconText: '!',
  iconColor: '#a074c4',
}

const FILE_TYPES: Record<string, FileType> = {
  mjs: JAVASCRIPT,
  js: JAVASCRIPT,
  jsx: {
    languageId: 'jsx',
    languageLabel: 'JavaScript JSX',
    iconText: REACT_ICON,
    iconColor: '#519aba',
  },
  tsx: {
    languageId: 'tsx',
    languageLabel: 'TypeScript JSX',
    iconText: REACT_ICON,
    iconColor: '#519aba',
  },
  java: {
    languageId: 'java',
    languageLabel: 'Java',
    iconText: 'J',
    iconColor: '#cc3e44',
  },
  py: {
    languageId: 'python',
    languageLabel: 'Python',
    iconText: 'Py',
    iconColor: '#519aba',
  },
  sql: {
    languageId: 'sql',
    languageLabel: 'SQL',
    iconText: 'DB',
    iconColor: '#f55385',
  },
  yaml: YAML,
  yml: YAML,
  ts: {
    languageId: 'typescript',
    languageLabel: 'TypeScript',
    iconText: 'TS',
    iconColor: '#519aba',
  },
  json: {
    languageId: 'json',
    languageLabel: 'JSON',
    iconText: '{}',
    iconColor: '#cbcb41',
  },
  md: {
    languageId: 'markdown',
    languageLabel: 'Markdown',
    iconText: 'M↓',
    iconColor: '#519aba',
  },
  css: {
    languageId: 'css',
    languageLabel: 'CSS',
    iconText: '#',
    iconColor: '#519aba',
  },
  html: {
    languageId: 'html',
    languageLabel: 'HTML',
    iconText: '<>',
    iconColor: '#e37933',
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
