import { sampleNewsCategories, type NewsArticle } from './sampleNews'

// 터미널 명령어 결과. 줄마다 ANSI 색 코드가 들어갈 수 있다
export type CommandResult = {
  lines: string[]
  shouldClear: boolean
}

type NumberedArticle = {
  number: number
  categoryName: string
  article: NewsArticle
}

const YELLOW = '\x1b[33m'
const CYAN = '\x1b[36m'
const DIM = '\x1b[2m'
const RESET = '\x1b[0m'

const HELP_LINES = [
  'news ls              카테고리 목록',
  'news ls <카테고리>    카테고리의 기사 목록',
  'news cat <번호>       기사 보기',
  'news grep <키워드>    제목·내용에서 키워드 검색',
  'news bookmark <번호>  북마크',
  'clear                화면 지우기',
]

// 진짜 쉘을 실행하지 않고, 정해진 뉴스 명령어만 해석한다
export function runNewsCommand(input: string): CommandResult {
  const [command = '', subcommand = '', ...rest] = input.trim().split(/\s+/)
  const argument = rest.join(' ')

  if (command === '') {
    return output([])
  }
  if (command === 'clear') {
    return { lines: [], shouldClear: true }
  }
  if (command === 'help') {
    return output(HELP_LINES)
  }
  if (command !== 'news') {
    return output([`zsh: command not found: ${command}`])
  }
  return runNewsSubcommand(subcommand, argument)
}

function runNewsSubcommand(
  subcommand: string,
  argument: string,
): CommandResult {
  if (subcommand === 'ls') {
    return output(argument === '' ? listCategories() : listArticles(argument))
  }
  if (subcommand === 'cat') {
    return output(showArticle(argument))
  }
  if (subcommand === 'grep') {
    return output(searchArticles(argument))
  }
  if (subcommand === 'bookmark') {
    return output(bookmarkArticle(argument))
  }
  return output(HELP_LINES)
}

function listCategories(): string[] {
  return sampleNewsCategories.map(
    (category) =>
      `${CYAN}${toCategoryName(category.fileName)}${RESET}  ${DIM}기사 ${category.articles.length}건${RESET}`,
  )
}

function listArticles(categoryName: string): string[] {
  const articles = getNumberedArticles().filter(
    (numbered) => numbered.categoryName === categoryName,
  )
  if (articles.length === 0) {
    return [
      `news: '${categoryName}' 카테고리가 없습니다. news ls로 목록을 확인하세요.`,
    ]
  }
  return articles.map(toArticleLine)
}

function showArticle(numberText: string): string[] {
  const numbered = findArticle(numberText)
  if (numbered === undefined) {
    return [`news: ${numberText || '(번호 없음)'}번 기사가 없습니다.`]
  }
  const { article } = numbered
  return [
    `${YELLOW}${article.title}${RESET}`,
    `${DIM}${article.source}${RESET}`,
    '',
    article.content,
    '',
    `${CYAN}${article.link}${RESET}`,
  ]
}

function searchArticles(keyword: string): string[] {
  if (keyword === '') {
    return ['usage: news grep <키워드>']
  }
  const matches = getNumberedArticles().filter(
    ({ article }) =>
      article.title.includes(keyword) || article.content.includes(keyword),
  )
  if (matches.length === 0) {
    return [`news: '${keyword}'이(가) 들어간 기사가 없습니다.`]
  }
  return matches.map(toArticleLine)
}

function bookmarkArticle(numberText: string): string[] {
  if (findArticle(numberText) === undefined) {
    return [`news: ${numberText || '(번호 없음)'}번 기사가 없습니다.`]
  }
  return ['북마크는 로그인한 뒤 쓸 수 있습니다.']
}

// 번호는 모든 카테고리의 기사를 이어서 1번부터 매긴다
function getNumberedArticles(): NumberedArticle[] {
  return sampleNewsCategories
    .flatMap((category) =>
      category.articles.map((article) => ({
        categoryName: toCategoryName(category.fileName),
        article,
      })),
    )
    .map((numbered, index) => ({ ...numbered, number: index + 1 }))
}

function findArticle(numberText: string): NumberedArticle | undefined {
  const number = Number(numberText)
  return getNumberedArticles().find((numbered) => numbered.number === number)
}

function toArticleLine({
  number,
  categoryName,
  article,
}: NumberedArticle): string {
  return `${YELLOW}${String(number).padStart(3)}${RESET}  ${DIM}[${categoryName}]${RESET} ${article.title}`
}

function toCategoryName(fileName: string): string {
  return fileName.replace(/\.[^.]+$/, '')
}

function output(lines: string[]): CommandResult {
  return { lines, shouldClear: false }
}
