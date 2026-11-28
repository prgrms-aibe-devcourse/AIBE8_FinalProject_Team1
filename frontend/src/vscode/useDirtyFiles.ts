import { useState } from 'react'
import { isInside } from './useExplorerTree'

// VSCode의 DirtyFilesIndicator처럼, 마지막으로 저장한 내용과 지금 내용이 다른 파일을 "저장 안 됨"으로 본다.
// 저장 안 한 파일 수는 탐색기 배지와 탭의 ● 표시에 쓴다
export function useDirtyFiles() {
  const [savedContentByPath, setSavedContentByPath] = useState<
    Record<string, string>
  >({})
  const [dirtyPaths, setDirtyPaths] = useState<Set<string>>(() => new Set())

  const getSavedContent = (path: string) => savedContentByPath[path] ?? ''

  const changeContent = (path: string, content: string) => {
    const isDirty = content !== getSavedContent(path)
    if (isDirty === dirtyPaths.has(path)) {
      return
    }
    const nextPaths = new Set(dirtyPaths)
    if (isDirty) {
      nextPaths.add(path)
    } else {
      nextPaths.delete(path)
    }
    setDirtyPaths(nextPaths)
  }

  const saveFile = (path: string, content: string) => {
    setSavedContentByPath({ ...savedContentByPath, [path]: content })
    const nextPaths = new Set(dirtyPaths)
    nextPaths.delete(path)
    setDirtyPaths(nextPaths)
  }

  // 저장하지 않고 탭을 닫으면 고친 내용을 버린다 (에디터 내용은 NewsEditor가 되돌린다)
  const discardChanges = (path: string) => {
    const nextPaths = new Set(dirtyPaths)
    nextPaths.delete(path)
    setDirtyPaths(nextPaths)
  }

  // 탐색기에서 지운 파일(폴더라면 안의 파일까지)은 저장 기록도 지운다
  const forgetFiles = (path: string) => {
    const isForgotten = (filePath: string) =>
      filePath === path || isInside(filePath, path)
    setDirtyPaths(
      new Set([...dirtyPaths].filter((filePath) => !isForgotten(filePath))),
    )
    setSavedContentByPath(
      Object.fromEntries(
        Object.entries(savedContentByPath).filter(
          ([filePath]) => !isForgotten(filePath),
        ),
      ),
    )
  }

  // 이름을 바꾸면 저장 기록도 새 경로로 옮긴다
  const renameFiles = (path: string, newPath: string) => {
    const toNewPath = (filePath: string) => {
      if (filePath === path) {
        return newPath
      }
      return isInside(filePath, path)
        ? newPath + filePath.slice(path.length)
        : filePath
    }
    setDirtyPaths(new Set([...dirtyPaths].map(toNewPath)))
    setSavedContentByPath(
      Object.fromEntries(
        Object.entries(savedContentByPath).map(([filePath, content]) => [
          toNewPath(filePath),
          content,
        ]),
      ),
    )
  }

  return {
    dirtyPaths,
    getSavedContent,
    changeContent,
    saveFile,
    discardChanges,
    forgetFiles,
    renameFiles,
  }
}
