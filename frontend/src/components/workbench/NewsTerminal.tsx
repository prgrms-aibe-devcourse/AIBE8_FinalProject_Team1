import { useEffect, useRef } from 'react'
import { FitAddon } from '@xterm/addon-fit'
import { Terminal } from '@xterm/xterm'
import '@xterm/xterm/css/xterm.css'
import { runNewsCommand } from '../../news/newsCommands'
import styles from './NewsTerminal.module.css'

const PROMPT = '\x1b[32mdev@readme\x1b[0m news % '
const WELCOME_MESSAGE = '\x1b[2mType "help" to see news commands.\x1b[0m'

// xterm.js가 보내는 키 입력 값
const ENTER = '\r'
const BACKSPACE = '\u007f'
const CTRL_C = '\u0003'
const ARROW_UP = '\x1b[A'
const ARROW_DOWN = '\x1b[B'
const ESCAPE_PREFIX = '\x1b'

// 한글 등 넓은 글자는 터미널에서 두 칸을 차지해서, 지울 때도 두 칸을 지운다
const WIDE_CHARACTER = /[ᄀ-ᇿ⺀-꓏가-힣豈-﫿︰-﹏＀-｠￠-￦]/

const TERMINAL_THEME = {
  background: '#181818',
  foreground: '#cccccc',
  cursor: '#cccccc',
  selectionBackground: '#264f78',
}

// xterm.js는 이 컴포넌트에서만 쓴다 (CLEAN_CODE.md 6. 외부 코드와의 경계).
// 진짜 쉘 대신 runNewsCommand가 입력한 줄을 해석한다
export function NewsTerminal() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (container === null) {
      return
    }

    const terminal = new Terminal({
      theme: TERMINAL_THEME,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      fontSize: 13,
      cursorBlink: true,
    })
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

    const lineEditor = createLineEditor(terminal)
    terminal.writeln(WELCOME_MESSAGE)
    terminal.write(PROMPT)
    const dataListener = terminal.onData(lineEditor.handleInput)

    return () => {
      dataListener.dispose()
      resizeObserver.disconnect()
      terminal.dispose()
    }
  }, [])

  return <div ref={containerRef} className={styles.terminal} />
}

// 한 줄 입력(글자 쓰기, 지우기, 이전 명령 불러오기)을 처리한다
function createLineEditor(terminal: Terminal) {
  let currentLine = ''
  const history: string[] = []
  let historyIndex = 0

  const eraseCurrentLine = () => {
    for (const character of [...currentLine].reverse()) {
      eraseCharacter(character)
    }
    currentLine = ''
  }

  const eraseCharacter = (character: string) => {
    const width = WIDE_CHARACTER.test(character) ? 2 : 1
    terminal.write('\b \b'.repeat(width))
  }

  const replaceLine = (line: string) => {
    eraseCurrentLine()
    currentLine = line
    terminal.write(line)
  }

  const runCurrentLine = () => {
    terminal.write('\r\n')
    if (currentLine.trim() !== '') {
      history.push(currentLine)
    }
    historyIndex = history.length

    const result = runNewsCommand(currentLine)
    if (result.shouldClear) {
      terminal.clear()
    }
    result.lines.forEach((line) => terminal.writeln(line))
    currentLine = ''
    terminal.write(PROMPT)
  }

  const handleInput = (data: string) => {
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
      terminal.write('^C\r\n' + PROMPT)
      currentLine = ''
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
    terminal.write(data)
  }

  return { handleInput }
}
