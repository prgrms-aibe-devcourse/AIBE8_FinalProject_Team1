import { newsCommand } from '../domains/news/newsCommands'
import {
  failure,
  success,
  type CommandContext,
  type CommandResult,
  type TerminalCommand,
} from './terminalCommand'

// 새 도메인 명령어는 자기 도메인 폴더에 만들고 여기에 한 줄 추가한다
const TERMINAL_COMMANDS: TerminalCommand[] = [newsCommand]

const BUILT_IN_USAGE = [
  'help                 명령어 목록',
  'clear                화면 지우기',
]

// 진짜 쉘을 실행하지 않고, 등록된 명령어만 해석한다
export async function runTerminalCommand(
  input: string,
  context: CommandContext,
): Promise<CommandResult> {
  const [name = '', ...args] = input.trim().split(/\s+/)

  if (name === '') {
    return success([])
  }
  if (name === 'clear') {
    return { lines: [], shouldClear: true, isError: false }
  }
  if (name === 'help') {
    return success([
      ...TERMINAL_COMMANDS.flatMap((command) => command.usage),
      ...BUILT_IN_USAGE,
    ])
  }

  const command = TERMINAL_COMMANDS.find((command) => command.name === name)
  if (command === undefined) {
    return failure(`zsh: command not found: ${name}`)
  }
  // 서버 요청이 실패해도 터미널이 멈추지 않게 실패 결과로 보여준다
  try {
    return await command.run(args, context)
  } catch {
    return failure(
      `${name}: 명령을 실행하지 못했습니다. 잠시 후 다시 시도하세요.`,
    )
  }
}
