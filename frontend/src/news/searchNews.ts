import { toNewsFilePath } from './newsFiles'
import { sampleNewsCategories } from './sampleNews'
import { toNewsFileContent } from './toNewsFileContent'

// 에디터에 열리는 뉴스 파일 안에서 키워드가 들어간 줄
export type NewsLineMatch = {
  path: string
  fileName: string
  lineNumber: number
  column: number
  lineText: string
}

const MAX_MATCH_COUNT = 50

// 에디터에 보이는 내용과 똑같은 텍스트에서 찾아야 줄 번호가 맞는다
export function searchNewsLines(keyword: string): NewsLineMatch[] {
  const lowerKeyword = keyword.trim().toLowerCase()
  if (lowerKeyword === '') {
    return []
  }

  return sampleNewsCategories
    .flatMap((category) =>
      toNewsFileContent(category)
        .split('\n')
        .map((lineText, index) => ({
          path: toNewsFilePath(category),
          fileName: category.fileName,
          lineNumber: index + 1,
          column: lineText.toLowerCase().indexOf(lowerKeyword) + 1,
          lineText: lineText.trim(),
        })),
    )
    .filter((match) => match.column > 0)
    .slice(0, MAX_MATCH_COUNT)
}
