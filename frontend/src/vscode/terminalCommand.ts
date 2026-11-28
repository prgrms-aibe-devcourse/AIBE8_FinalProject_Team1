import type { NewsCategory } from '../api/news'

// 터미널 명령어 결과. 줄마다 ANSI 색 코드가 들어갈 수 있다.
// isError면 VSCode처럼 프롬프트 앞에 실패 표시(빨간 ⊗)를 한다
export type CommandResult = {
  lines: string[]
  shouldClear: boolean
  isError: boolean
}

// 명령이 쓸 수 있게 터미널이 넘겨주는 재료. 도메인 명령에 필요한 값이 생기면 여기에 추가한다
export type CommandContext = {
  newsCategories: NewsCategory[]
}

// 도메인 명령어 하나의 모양. 'news ls 사회'를 입력하면 name이 'news'인 명령의 run이
// args ['ls', '사회']로 실행된다. 서버에 요청하는 명령도 있어서 결과는 Promise로 돌려준다
export type TerminalCommand = {
  name: string
  usage: string[]
  run: (args: string[], context: CommandContext) => Promise<CommandResult>
}

export function success(lines: string[]): CommandResult {
  return { lines, shouldClear: false, isError: false }
}

export function failure(message: string): CommandResult {
  return { lines: [message], shouldClear: false, isError: true }
}
