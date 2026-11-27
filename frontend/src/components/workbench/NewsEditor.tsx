import Editor, { loader, type OnMount } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
import EditorWorker from 'monaco-editor/editor/editor.worker?worker'
import TypeScriptWorker from 'monaco-editor/languages/features/typescript/ts.worker?worker'

export type CursorPosition = {
  lineNumber: number
  column: number
}

type NewsEditorProps = {
  fileName: string
  content: string
  onCursorChange: (position: CursorPosition) => void
}

// CDN 대신 설치한 monaco-editor 패키지를 쓴다 (회사망·오프라인에서도 뜨게)
self.MonacoEnvironment = {
  getWorker(_workerId, label) {
    if (label === 'typescript' || label === 'javascript') {
      return new TypeScriptWorker()
    }
    return new EditorWorker()
  },
}
loader.config({ monaco })

// 기사 파일은 코드처럼 보이기만 하면 되므로 타입 오류 밑줄을 끈다
monaco.typescript.typescriptDefaults.setDiagnosticsOptions({
  noSemanticValidation: true,
  noSyntaxValidation: true,
})

const THEME_NAME = 'dark-modern'

monaco.editor.defineTheme(THEME_NAME, {
  base: 'vs-dark',
  inherit: true,
  rules: [],
  colors: {
    'editor.background': '#1F1F1F',
    'editor.foreground': '#CCCCCC',
    'editorLineNumber.foreground': '#6E7681',
    'editorLineNumber.activeForeground': '#CCCCCC',
  },
})

const EDITOR_OPTIONS: monaco.editor.IStandaloneEditorConstructionOptions = {
  readOnly: true,
  automaticLayout: true,
  fontFamily: 'Menlo, Monaco, "Courier New", monospace',
  fontSize: 14,
  lineHeight: 22,
  minimap: { enabled: true },
}

// Monaco Editor는 이 컴포넌트에서만 쓴다 (CLEAN_CODE.md 6. 외부 코드와의 경계)
export function NewsEditor({
  fileName,
  content,
  onCursorChange,
}: NewsEditorProps) {
  const handleMount: OnMount = (editor) => {
    editor.onDidChangeCursorPosition((event) => {
      onCursorChange({
        lineNumber: event.position.lineNumber,
        column: event.position.column,
      })
    })
  }

  return (
    <Editor
      theme={THEME_NAME}
      path={fileName}
      defaultLanguage="typescript"
      defaultValue={content}
      options={EDITOR_OPTIONS}
      onMount={handleMount}
    />
  )
}
