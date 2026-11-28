import { useState } from 'react'
import { Command } from 'cmdk'
import type { NewsCategory } from '../../api/news'
import { toNewsFilePath } from '../../news/newsFiles'
import { searchNewsLines, type NewsLineMatch } from '../../news/searchNews'
import { FileIcon } from './FileIcon'
import styles from './CommandPalette.module.css'

type CommandPaletteProps = {
  newsCategories: NewsCategory[]
  onOpenFile: (path: string) => void
  onSelectMatch: (match: NewsLineMatch, keyword: string) => void
  onClose: () => void
}

// cmdk는 이 컴포넌트에서만 쓴다 (CLEAN_CODE.md 6. 외부 코드와의 경계).
// 키워드가 비면 파일 목록, 입력하면 키워드가 들어간 기사 줄 목록을 보여준다
export function CommandPalette({
  newsCategories,
  onOpenFile,
  onSelectMatch,
  onClose,
}: CommandPaletteProps) {
  const [keyword, setKeyword] = useState('')
  const matches = searchNewsLines(newsCategories, keyword)
  const isSearching = keyword.trim() !== ''

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <Command
        className={styles.palette}
        shouldFilter={false}
        label="Search news"
        onMouseDown={(event) => event.stopPropagation()}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            onClose()
          }
        }}
      >
        <Command.Input
          className={styles.input}
          value={keyword}
          onValueChange={setKeyword}
          placeholder="Search news by keyword"
          autoFocus
        />
        <Command.List className={styles.list}>
          <Command.Empty className={styles.empty}>
            No matching results
          </Command.Empty>

          {!isSearching &&
            newsCategories.map((category) => (
              <Command.Item
                key={category.fileName}
                value={category.fileName}
                className={styles.item}
                onSelect={() => onOpenFile(toNewsFilePath(category))}
              >
                <FileIcon fileName={category.fileName} />
                <span>{category.fileName}</span>
                <span className={styles.description}>src</span>
              </Command.Item>
            ))}

          {matches.map((match) => (
            <Command.Item
              key={`${match.path}:${match.lineNumber}`}
              value={`${match.path}:${match.lineNumber}`}
              className={styles.item}
              onSelect={() => onSelectMatch(match, keyword.trim())}
            >
              <FileIcon fileName={match.fileName} />
              <span className={styles.lineText}>{match.lineText}</span>
              <span className={styles.description}>
                {match.fileName} · Ln {match.lineNumber}
              </span>
            </Command.Item>
          ))}
        </Command.List>
      </Command>
    </div>
  )
}
