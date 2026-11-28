import type { NewsArticle, NewsCategory } from '../../api/news'
import {
  failure,
  success,
  type CommandResult,
  type TerminalCommand,
} from '../../vscode/terminalCommand'

type NumberedArticle = {
  number: number
  categoryName: string
  article: NewsArticle
}

const YELLOW = '\x1b[33m'
const CYAN = '\x1b[36m'
const DIM = '\x1b[2m'
const RESET = '\x1b[0m'

const NEWS_USAGE = [
  'news ls              카테고리 목록',
  'news ls <카테고리>    카테고리의 기사 목록',
  'news cat <번호>       기사 보기',
  'news grep <키워드>    제목·내용에서 키워드 검색',
  'news bookmark <번호>  북마크',
]

// 터미널의 news 명령어. 다른 도메인 명령어도 이 모양을 따라 만든다
export const newsCommand: TerminalCommand = {
  name: 'news',
  usage: NEWS_USAGE,
  run: async ([subcommand = '', ...rest], { newsCategories }) =>
    runNewsSubcommand(newsCategories, subcommand, rest.join(' ')),
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
  return success(NEWS_USAGE)
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
