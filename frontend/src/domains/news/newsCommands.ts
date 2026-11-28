import type { NewsArticle, NewsCategory } from '../../api/news'

// 터미널 명령어 결과. 줄마다 ANSI 색 코드가 들어갈 수 있다.
// isError면 VSCode처럼 프롬프트 앞에 실패 표시(빨간 ⊗)를 한다
export type CommandResult = {
  lines: string[]
  shouldClear: boolean
  isError: boolean
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
export function runNewsCommand(
  categories: NewsCategory[],
  input: string,
): CommandResult {
  const [command = '', subcommand = '', ...rest] = input.trim().split(/\s+/)
  const argument = rest.join(' ')

  if (command === '') {
    return success([])
  }
  if (command === 'clear') {
    return { lines: [], shouldClear: true, isError: false }
  }
  if (command === 'help') {
    return success(HELP_LINES)
  }
  if (command !== 'news') {
    return failure(`zsh: command not found: ${command}`)
  }
  return runNewsSubcommand(categories, subcommand, argument)
}

function runNewsSubcommand(
  categories: NewsCategory[],
  subcommand: string,
  argument: string,
): CommandResult {
  if (subcommand === 'ls') {
    return argument === ''
      ? listCategories(categories)
      : listArticles(categories, argument)
  }
  if (subcommand === 'cat') {
    return showArticle(categories, argument)
  }
  if (subcommand === 'grep') {
    return searchArticles(categories, argument)
  }
  if (subcommand === 'bookmark') {
    return bookmarkArticle(categories, argument)
  }
  return success(HELP_LINES)
}

function listCategories(categories: NewsCategory[]): CommandResult {
  return success(
    categories.map(
      (category) =>
        `${CYAN}${toCategoryName(category.fileName)}${RESET}  ${DIM}기사 ${category.articles.length}건${RESET}`,
    ),
  )
}

function listArticles(
  categories: NewsCategory[],
  categoryName: string,
): CommandResult {
  const articles = getNumberedArticles(categories).filter(
    (numbered) => numbered.categoryName === categoryName,
  )
  if (articles.length === 0) {
    return failure(
      `news: '${categoryName}' 카테고리가 없습니다. news ls로 목록을 확인하세요.`,
    )
  }
  return success(articles.map(toArticleLine))
}

function showArticle(
  categories: NewsCategory[],
  numberText: string,
): CommandResult {
  const numbered = findArticle(categories, numberText)
  if (numbered === undefined) {
    return failure(`news: ${numberText || '(번호 없음)'}번 기사가 없습니다.`)
  }
  const { article } = numbered
  return success([
    `${YELLOW}${article.title}${RESET}`,
    `${DIM}${article.source}${RESET}`,
    '',
    article.content,
    '',
    `${CYAN}${article.link}${RESET}`,
  ])
}

function searchArticles(
  categories: NewsCategory[],
  keyword: string,
): CommandResult {
  if (keyword === '') {
    return failure('usage: news grep <키워드>')
  }
  const matches = getNumberedArticles(categories).filter(
    ({ article }) =>
      article.title.includes(keyword) || article.content.includes(keyword),
  )
  if (matches.length === 0) {
    return failure(`news: '${keyword}'이(가) 들어간 기사가 없습니다.`)
  }
  return success(matches.map(toArticleLine))
}

function bookmarkArticle(
  categories: NewsCategory[],
  numberText: string,
): CommandResult {
  if (findArticle(categories, numberText) === undefined) {
    return failure(`news: ${numberText || '(번호 없음)'}번 기사가 없습니다.`)
  }
  return failure('북마크는 로그인한 뒤 쓸 수 있습니다.')
}

// 번호는 모든 카테고리의 기사를 이어서 1번부터 매긴다
function getNumberedArticles(categories: NewsCategory[]): NumberedArticle[] {
  return categories
    .flatMap((category) =>
      category.articles.map((article) => ({
        categoryName: toCategoryName(category.fileName),
        article,
      })),
    )
    .map((numbered, index) => ({ ...numbered, number: index + 1 }))
}

function findArticle(
  categories: NewsCategory[],
  numberText: string,
): NumberedArticle | undefined {
  const number = Number(numberText)
  return getNumberedArticles(categories).find(
    (numbered) => numbered.number === number,
  )
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

function success(lines: string[]): CommandResult {
  return { lines, shouldClear: false, isError: false }
}

function failure(message: string): CommandResult {
  return { lines: [message], shouldClear: false, isError: true }
}
