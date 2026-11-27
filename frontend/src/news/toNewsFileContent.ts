import type { NewsArticle, NewsCategory } from './sampleNews'

// 카테고리 하나를 에디터에 열 TypeScript 파일 내용으로 바꾼다.
// 기사 하나가 객체 하나가 되어, 옆에서 보면 설정 파일을 읽는 것처럼 보인다.
export function toNewsFileContent(category: NewsCategory): string {
  const header = [
    `// ${category.label} 뉴스`,
    `// 기사 ${category.articles.length}건`,
    '',
  ]
  const articleBlocks = category.articles.map(toArticleBlock)

  return [...header, ...articleBlocks].join('\n')
}

function toArticleBlock(article: NewsArticle, index: number): string {
  const articleNumber = String(index + 1).padStart(2, '0')

  return [
    `// ${article.publishedAt} · ${article.press}`,
    `export const article${articleNumber} = {`,
    `  title: '${escapeQuote(article.title)}',`,
    `  summary: '${escapeQuote(article.summary)}',`,
    `  link: '${article.link}',`,
    '}',
    '',
  ].join('\n')
}

function escapeQuote(text: string): string {
  return text.replaceAll("'", "\\'")
}
