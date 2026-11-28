import type { NewsArticle, NewsCategory } from '../../api/news'

export const ARTICLES_VARIABLE_NAME = 'articles'

// 카테고리 하나를 에디터에 열 JavaScript 파일 내용으로 바꾼다.
// 팀 디자인 형식: const articles = [ { title, content, link, source }, ... ]
export function toNewsFileContent(category: NewsCategory): string {
  const articleBlocks = category.articles.map(toArticleBlock)

  return [
    `const ${ARTICLES_VARIABLE_NAME} = [`,
    ...articleBlocks,
    ']',
    '',
  ].join('\n')
}

// JSON.stringify로 감싸면 따옴표가 들어간 제목도 깨지지 않는 문자열이 된다
function toArticleBlock(article: NewsArticle): string {
  return [
    '  {',
    `    title: ${JSON.stringify(article.title)},`,
    `    content: ${JSON.stringify(article.content)},`,
    `    link: [${JSON.stringify(article.link)}],`,
    `    source: ${JSON.stringify(article.source)},`,
    '  },',
  ].join('\n')
}
