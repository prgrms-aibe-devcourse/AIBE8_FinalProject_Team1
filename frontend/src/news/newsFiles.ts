import { sampleNewsCategories, type NewsCategory } from './sampleNews'

// 뉴스 카테고리 파일은 탐색기의 src 폴더 안에 있다
export const NEWS_FOLDER_NAME = 'src'

export function toNewsFilePath(category: NewsCategory): string {
  return `${NEWS_FOLDER_NAME}/${category.fileName}`
}

export function findNewsCategory(path: string): NewsCategory | undefined {
  return sampleNewsCategories.find(
    (category) => toNewsFilePath(category) === path,
  )
}
