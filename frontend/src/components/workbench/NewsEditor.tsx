import { useEffect, useRef, useState } from 'react'
import Editor, { loader, type OnMount } from '@monaco-editor/react'
import { shikiToMonaco } from '@shikijs/monaco'
import * as monaco from 'monaco-editor'
import EditorWorker from 'monaco-editor/editor/editor.worker?worker'
import CssWorker from 'monaco-editor/languages/features/css/css.worker?worker'
import HtmlWorker from 'monaco-editor/languages/features/html/html.worker?worker'
import JsonWorker from 'monaco-editor/languages/features/json/json.worker?worker'
import TypeScriptWorker from 'monaco-editor/languages/features/typescript/ts.worker?worker'
import { createHighlighter, type ThemeRegistration } from 'shiki'
import { bundledThemes } from 'shiki/themes'
import styles from './NewsEditor.module.css'

export type CursorPosition = {
  lineNumber: number
  column: number
}

// Command Palette에서 고른 검색 결과. requestId가 바뀔 때마다 그 줄로 이동한다
export type SearchReveal = {
  requestId: number
  path: string
  lineNumber: number
  column: number
  keyword: string
}

type NewsEditorProps = {
  path: string
  languageId: string
  content: string
  isReadOnly: boolean
  searchReveal: SearchReveal | undefined
  onCursorChange: (position: CursorPosition) => void
  onContentChange: (path: string, content: string) => void
  onSave: (path: string, content: string) => void
}

const THEME_NAME = 'readme-dark-modern'
const FONT_FAMILY = 'Menlo, Monaco, "Courier New", monospace'
const HIGHLIGHT_LANGUAGES = [
  'javascript',
  'typescript',
  'jsx',
  'tsx',
  'json',
  'markdown',
  'css',
  'html',
  'java',
  'python',
  'sql',
  'yaml',
]

// Monaco에는 jsx·tsx 언어가 따로 없어서 등록해야 Shiki가 JSX 문법으로 색을 칠한다.
// 괄호 색 구분·자동 닫기가 되도록 괄호 규칙도 같이 넣는다
const EXTRA_MONACO_LANGUAGES = ['jsx', 'tsx']
const JSX_LANGUAGE_CONFIGURATION: monaco.languages.LanguageConfiguration = {
  comments: { lineComment: '//', blockComment: ['/*', '*/'] },
  brackets: [
    ['{', '}'],
    ['[', ']'],
    ['(', ')'],
  ],
  autoClosingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
    { open: '`', close: '`' },
  ],
}

// CDN 대신 설치한 monaco-editor 패키지를 쓴다 (회사망·오프라인에서도 뜨게).
// 언어마다 자동 완성·검사를 맡는 작업자(worker)가 따로 있다
self.MonacoEnvironment = {
  getWorker(_workerId, label) {
    if (label === 'typescript' || label === 'javascript') {
      return new TypeScriptWorker()
    }
    if (label === 'json') {
      return new JsonWorker()
    }
    if (label === 'css') {
      return new CssWorker()
    }
    if (label === 'html') {
      return new HtmlWorker()
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
  EXTRA_MONACO_LANGUAGES.forEach((id) => {
    monaco.languages.register({ id })
    monaco.languages.setLanguageConfiguration(id, JSX_LANGUAGE_CONFIGURATION)
  })
  shikiToMonaco(highlighter, monaco)
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
      'editorIndentGuide.background1': '#404040',
      'editorIndentGuide.activeBackground1': '#707070',
      'editorBracketHighlight.foreground1': '#FFD700',
      'editorBracketHighlight.foreground2': '#DA70D6',
      'editorBracketHighlight.foreground3': '#179FFF',
    },
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
  automaticLayout: true,
  fontFamily: FONT_FAMILY,
  fontSize: 16,
  lineHeight: 24,
  minimap: { enabled: true },
  // VSCode 기본값: 괄호를 짝마다 다른 색으로, 들여쓰기 안내선 표시
  bracketPairColorization: { enabled: true },
  guides: { indentation: true, highlightActiveIndentation: true },
}

// Monaco Editor는 이 컴포넌트와 editorModels.ts에서만 쓴다 (CLEAN_CODE.md 6. 외부 코드와의 경계)
export function NewsEditor({
  path,
  languageId,
  content,
  isReadOnly,
  searchReveal,
  onCursorChange,
  onContentChange,
  onSave,
}: NewsEditorProps) {
  const isEditorReady = useEditorReady()
  // Monaco 이벤트는 처음 띄울 때 한 번만 등록하므로, 탭을 바꿔도 지금 경로와 콜백을 쓰도록 ref에 둔다
  const latestRef = useRef({ path, onContentChange, onSave })
  useEffect(() => {
    latestRef.current = { path, onContentChange, onSave }
  })
  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor>()
  const lineHighlightRef =
    useRef<monaco.editor.IEditorDecorationsCollection>(undefined)
  // 다른 탭을 보고 돌아왔을 때 같은 검색 결과로 다시 이동하지 않게 한다
  const handledRequestIdRef = useRef<number>(undefined)

  // 검색한 줄로 이동해 줄 전체를 강조하고, 찾기 창(⌘F)에 키워드를 넣어 다음 일치로 이동할 수 있게 한다
  useEffect(() => {
    if (
      editor === undefined ||
      searchReveal?.path !== path ||
      searchReveal.requestId === handledRequestIdRef.current
    ) {
      return
    }
    handledRequestIdRef.current = searchReveal.requestId
    const { lineNumber, column, keyword } = searchReveal
    const keywordRange = new monaco.Range(
      lineNumber,
      column,
      lineNumber,
      column + keyword.length,
    )

    lineHighlightRef.current?.clear()
    lineHighlightRef.current = editor.createDecorationsCollection([
      {
        range: keywordRange,
        options: { isWholeLine: true, className: styles.searchLine },
      },
    ])
    editor.revealLineInCenter(lineNumber)
    editor.setSelection(keywordRange)
    editor.focus()
    editor.trigger('command-palette', 'actions.findWithSelection', null)
  }, [editor, path, searchReveal])

  // 이름을 바꿔 확장자가 달라지면 문법 색도 새 언어로 바꾼다
  useEffect(() => {
    const model = editor?.getModel()
    if (model && model.getLanguageId() !== languageId) {
      monaco.editor.setModelLanguage(model, languageId)
    }
  }, [editor, path, languageId])

  const handleMount: OnMount = (mountedEditor) => {
    setEditor(mountedEditor)
    mountedEditor.onDidChangeModelContent(() => {
      const latest = latestRef.current
      latest.onContentChange(latest.path, mountedEditor.getValue())
    })
    // ⌘S(윈도우는 Ctrl+S)로 저장
    mountedEditor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
      () => {
        const latest = latestRef.current
        latest.onSave(latest.path, mountedEditor.getValue())
      },
    )
    mountedEditor.onDidChangeCursorPosition((event) => {
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
      path={path}
      defaultLanguage={languageId}
      defaultValue={content}
      options={{ ...EDITOR_OPTIONS, readOnly: isReadOnly }}
      // 탭을 모두 닫아 에디터가 사라져도 파일 내용(모델)을 지우지 않는다
      keepCurrentModel
      onMount={handleMount}
    />
  )
}
