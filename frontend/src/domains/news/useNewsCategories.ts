import { useEffect, useState } from 'react'
import { getNewsCategories, type NewsCategory } from '../../api/news'

// 화면이 열릴 때 뉴스를 한 번 받아 온다. 받아 오기 전에는 빈 목록이다
export function useNewsCategories() {
  const [categories, setCategories] = useState<NewsCategory[]>([])
  const [hasLoadError, setHasLoadError] = useState(false)

  useEffect(() => {
    // 받아 오기 전에 화면이 사라졌으면 결과를 버린다
    let isCancelled = false

    const loadCategories = async () => {
      try {
        const loadedCategories = await getNewsCategories()
        if (!isCancelled) {
          setCategories(loadedCategories)
        }
      } catch {
        if (!isCancelled) {
          setHasLoadError(true)
        }
      }
    }

    void loadCategories()
    return () => {
      isCancelled = true
    }
  }, [])

  return { categories, hasLoadError }
}
