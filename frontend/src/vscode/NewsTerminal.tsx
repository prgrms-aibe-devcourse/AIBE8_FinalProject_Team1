import { useEffect, useRef } from 'react'
import { FitAddon } from '@xterm/addon-fit'
import { Terminal, type IDecoration, type IMarker } from '@xterm/xterm'
import '@xterm/xterm/css/xterm.css'
import type { NewsCategory } from '../api/news'
import { runNewsCommand } from '../domains/news/newsCommands'
import styles from './NewsTerminal.module.css'

const PROMPT = 'dev@readme news % '
const WELCOME_MESSAGE = '\x1b[2mType "help" to see news commands.\x1b[0m'

// 입력한 명령은 VSCode 터미널처럼 굵게 보인다
const BOLD = '\x1b[1m'
const NORMAL_WEIGHT = '\x1b[22m'

// xterm.js가 보내는 키 입력 값
const ENTER = '\r'
const BACKSPACE = '\u007f'
const CTRL_C = '\u0003'
const ARROW_UP = '\x1b[A'
const ARROW_DOWN = '\x1b[B'
const ESCAPE_PREFIX = '\x1b'

// 한글 등 넓은 글자는 터미널에서 두 칸을 차지해서, 지울 때도 두 칸을 지운다
const WIDE_CHARACTER = /[ᄀ-ᇿ⺀-꓏가-힣豈-﫿︰-﹏＀-｠￠-￦]/

// VSCode 기본 터미널 설정과 같은 값
const TERMINAL_OPTIONS = {
  fontFamily: 'Menlo, Monaco, "Courier New", monospace',
  fontSize: 13,
  lineHeight: 1.4,
  cursorBlink: true,
  // 명령 결과 표시에 쓰는 데코레이션 기능이 아직 실험 단계라 켜야 한다
  allowProposedApi: true,
  theme: {
    background: '#181818',
    foreground: '#cccccc',
    cursor: '#cccccc',
    selectionBackground: '#264f78',
  },
}

type CommandState = 'incomplete' | 'success' | 'error'

type NewsTerminalProps = {
  newsCategories: NewsCategory[]
}

// xterm.js는 이 컴포넌트에서만 쓴다 (CLEAN_CODE.md 6. 외부 코드와의 경계).
// 진짜 쉘 대신 runNewsCommand가 입력한 줄을 해석한다
export function NewsTerminal({ newsCategories }: NewsTerminalProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  // 터미널은 처음 한 번만 만들기 때문에, 명령을 실행할 때 최신 뉴스를 ref에서 읽는다
  const newsCategoriesRef = useRef(newsCategories)

  useEffect(() => {
    newsCategoriesRef.current = newsCategories
  }, [newsCategories])

  useEffect(() => {
    const container = containerRef.current
    if (container === null) {
      return
    }

    const terminal = new Terminal(TERMINAL_OPTIONS)
    const fitAddon = new FitAddon()
    terminal.loadAddon(fitAddon)
    terminal.open(container)
    fitAddon.fit()

    // 패널 크기가 바뀌거나 다른 탭에서 돌아와 보이게 되면 터미널 칸 수를 다시 맞춘다
    const resizeObserver = new ResizeObserver(() => {
      if (container.offsetWidth > 0) {
        fitAddon.fit()
      }
    })
    resizeObserver.observe(container)

    terminal.writeln(WELCOME_MESSAGE)
    const lineEditor = createLineEditor(
      terminal,
      () => newsCategoriesRef.current,
    )
    lineEditor.writePrompt()
    const dataListener = terminal.onData(lineEditor.handleInput)

    return () => {
      dataListener.dispose()
      resizeObserver.disconnect()
      terminal.dispose()
    }
  }, [])

  return <div ref={containerRef} className={styles.terminal} />
}

// 한 줄 입력(글자 쓰기, 지우기, 이전 명령 불러오기)과 명령 결과 표시를 처리한다
function createLineEditor(
  terminal: Terminal,
  getNewsCategories: () => NewsCategory[],
) {
  let currentLine = ''
  const history: string[] = []
  let historyIndex = 0
  let promptMarker: IMarker | undefined
  let pendingDecoration: IDecoration | undefined

  // 실행을 기다리는 프롬프트 줄에는 ○, 실행이 끝나면 성공 ● 또는 실패 ⊗로 바꾼다.
  // 빈 줄이나 Ctrl+C면 표시를 지운다
  const finishPrompt = (state: CommandState | undefined) => {
    pendingDecoration?.dispose()
    if (promptMarker !== undefined && state !== undefined) {
      addDecoration(terminal, promptMarker, state)
    }
  }

  // write는 비동기라서, 프롬프트가 실제로 찍힌 뒤에 그 줄을 표시해야 위치가 맞는다.
  // 그 사이에 들어온 입력(빠른 타이핑, 붙여넣기)은 모아 뒀다가 프롬프트가 찍힌 뒤 처리한다
  let isWaitingForPrompt = false
  const queuedInputs: string[] = []

  const writePrompt = () => {
    isWaitingForPrompt = true
    terminal.write(PROMPT, () => {
      promptMarker = terminal.registerMarker(0)
      pendingDecoration = addDecoration(terminal, promptMarker, 'incomplete')
      isWaitingForPrompt = false
      queuedInputs.splice(0).forEach(handleInput)
    })
  }

  const writeInput = (text: string) => {
    terminal.write(`${BOLD}${text}${NORMAL_WEIGHT}`)
  }

  const eraseCharacter = (character: string) => {
    const width = WIDE_CHARACTER.test(character) ? 2 : 1
    terminal.write('\b \b'.repeat(width))
  }

  const replaceLine = (line: string) => {
    for (const character of [...currentLine].reverse()) {
      eraseCharacter(character)
    }
    currentLine = line
    writeInput(line)
  }

  const runCurrentLine = () => {
    terminal.write('\r\n')
    const isEmptyLine = currentLine.trim() === ''
    if (!isEmptyLine) {
      history.push(currentLine)
    }
    historyIndex = history.length

    const result = runNewsCommand(getNewsCategories(), currentLine)
    // 빈 줄은 VSCode처럼 결과 표시를 하지 않는다
    finishPrompt(isEmptyLine ? undefined : result.isError ? 'error' : 'success')
    if (result.shouldClear) {
      terminal.clear()
    }
    result.lines.forEach((line) => terminal.writeln(line))
    currentLine = ''
    writePrompt()
  }

  const handleInput = (data: string) => {
    if (isWaitingForPrompt) {
      queuedInputs.push(data)
      return
    }
    if (data === ENTER) {
      runCurrentLine()
      return
    }
    if (data === BACKSPACE) {
      const characters = [...currentLine]
      const lastCharacter = characters.pop()
      if (lastCharacter !== undefined) {
        eraseCharacter(lastCharacter)
        currentLine = characters.join('')
      }
      return
    }
    if (data === CTRL_C) {
      terminal.write('^C\r\n')
      finishPrompt(undefined)
      currentLine = ''
      writePrompt()
      return
    }
    if (data === ARROW_UP && historyIndex > 0) {
      historyIndex -= 1
      replaceLine(history[historyIndex])
      return
    }
    if (data === ARROW_DOWN && historyIndex < history.length) {
      historyIndex += 1
      replaceLine(history[historyIndex] ?? '')
      return
    }
    // 방향키 같은 나머지 특수 키는 무시하고, 글자(붙여넣기·한글 조합 포함)만 받는다
    if (data.startsWith(ESCAPE_PREFIX) || data < ' ') {
      return
    }
    currentLine += data
    writeInput(data)
  }

  return { writePrompt, handleInput }
}

// VSCode처럼 프롬프트 줄 왼쪽 여백에 명령 상태 아이콘을 그린다
function addDecoration(
  terminal: Terminal,
  marker: IMarker,
  state: CommandState,
): IDecoration | undefined {
  const decoration = terminal.registerDecoration({ marker, x: 0 })
  decoration?.onRender((element) => {
    element.classList.add(
      'codicon',
      `codicon-terminal-decoration-${state}`,
      styles.decoration,
      styles[state],
    )
  })
  return decoration
}
