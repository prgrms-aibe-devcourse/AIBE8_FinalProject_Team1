import { useEffect, useState } from 'react'
import Editor, { loader, type OnMount } from '@monaco-editor/react'
import { shikiToMonaco } from '@shikijs/monaco'
import * as monaco from 'monaco-editor'
import EditorWorker from 'monaco-editor/editor/editor.worker?worker'
import TypeScriptWorker from 'monaco-editor/languages/features/typescript/ts.worker?worker'
import { createHighlighter, type ThemeRegistration } from 'shiki'
import { bundledThemes } from 'shiki/themes'
import '@fontsource/victor-mono/500.css'
import '@fontsource/victor-mono/500-italic.css'

export type CursorPosition = {
  lineNumber: number
  column: number
}

type NewsEditorProps = {
  fileName: string
  content: string
  onCursorChange: (position: CursorPosition) => void
}

const THEME_NAME = 'readme-dark-modern'
const FONT_FAMILY = '"Victor Mono", Menlo, Monaco, "Courier New", monospace'
const HIGHLIGHT_LANGUAGES = ['javascript', 'typescript']

// 키·변수 이름을 Victor Mono 기울임(필기체)으로 보여준다.
// shikiToMonaco는 색과 기울임을 한 쌍으로 찾으므로, Dark+ 색을 같이 적는다
const ITALIC_TOKEN_COLORS = [
  {
    scope: [
      'variable',
      'meta.definition.variable.name',
      'meta.object-literal.key',
    ],
    settings: { foreground: '#9CDCFE', fontStyle: 'italic' },
  },
  {
    scope: ['variable.other.constant'],
    settings: { foreground: '#4FC1FF', fontStyle: 'italic' },
  },
]

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
monaco.typescript.javascriptDefaults.setDiagnosticsOptions({
  noSemanticValidation: true,
  noSyntaxValidation: true,
})

const editorReady = setupEditor()

// Monaco 기본 색칠 규칙은 VSCode와 달라서, VSCode와 같은 TextMate 문법·테마를 쓰는 Shiki로 색을 칠한다
async function setupEditor() {
  const theme = await createTheme()
  const highlighter = await createHighlighter({
    themes: [theme],
    langs: HIGHLIGHT_LANGUAGES,
  })
  shikiToMonaco(highlighter, monaco)

  // 글꼴이 내려받아지기 전에 Monaco가 글자 폭을 재면 커서 위치가 어긋나서 먼저 기다린다
  await Promise.all([
    document.fonts.load('500 14px "Victor Mono"'),
    document.fonts.load('italic 500 14px "Victor Mono"'),
  ])
}

// Dark Modern은 Dark+와 코드 색이 같고 화면 색만 다르므로, Dark+에 Dark Modern 에디터 색을 덮어쓴다
async function createTheme(): Promise<ThemeRegistration> {
  const darkPlus = (await bundledThemes['dark-plus']()).default

  return {
    ...darkPlus,
    name: THEME_NAME,
    colors: {
      ...darkPlus.colors,
      'editor.background': '#1F1F1F',
      'editor.foreground': '#CCCCCC',
      'editorLineNumber.foreground': '#6E7681',
      'editorLineNumber.activeForeground': '#CCCCCC',
    },
    tokenColors: [...(darkPlus.tokenColors ?? []), ...ITALIC_TOKEN_COLORS],
  }
}

function useEditorReady() {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    editorReady.then(() => setIsReady(true))
  }, [])

  return isReady
}

const EDITOR_OPTIONS: monaco.editor.IStandaloneEditorConstructionOptions = {
  readOnly: true,
  automaticLayout: true,
  fontFamily: FONT_FAMILY,
  fontWeight: '500',
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
  const isEditorReady = useEditorReady()

  const handleMount: OnMount = (editor) => {
    editor.onDidChangeCursorPosition((event) => {
      onCursorChange({
        lineNumber: event.position.lineNumber,
        column: event.position.column,
      })
    })
  }

  if (!isEditorReady) {
    return null
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
