import { sampleNewsCategories } from '../domains/news/sampleNews'

export type NewsArticle = {
  title: string
  content: string
  link: string
  source: string
}

export type NewsCategory = {
  fileName: string
  articles: NewsArticle[]
}

// 백엔드 뉴스 API가 생기면 이 함수 안만 apiClient 호출로 바꾼다
export async function getNewsCategories(): Promise<NewsCategory[]> {
  return sampleNewsCategories
}
