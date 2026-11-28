import type { NewsCategory } from '../api/news'

// 뉴스 카테고리 파일은 탐색기의 src 폴더 안에 있다
export const NEWS_FOLDER_NAME = 'src'

export function toNewsFilePath(category: NewsCategory): string {
  return `${NEWS_FOLDER_NAME}/${category.fileName}`
}

export function findNewsCategory(
  categories: NewsCategory[],
  path: string,
): NewsCategory | undefined {
  return categories.find((category) => toNewsFilePath(category) === path)
}
